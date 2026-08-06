/**
 * Real-Time Speed Test Engine (WebSocket + HTTP Fallback)
 * Measures Ping, Jitter, Download Speed, Upload Speed
 */

export class SpeedTestEngine {
  constructor(onProgress) {
    this.onProgress = onProgress || (() => {});
    this.wsUrl = this.getWsUrl();
    this.ws = null;
  }

  getWsUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
  }

  async runFullTest() {
    const results = {
      ping: 0,
      jitter: 0,
      download: 0,
      downloadPeak: 0,
      upload: 0,
      uploadPeak: 0,
    };

    try {
      // Step 1: Ping & Jitter Test
      this.onProgress({ stage: 'ping', message: 'Measuring Ping & Jitter...', currentSpeed: 0 });
      const pingData = await this.testPingAndJitter();
      results.ping = pingData.ping;
      results.jitter = pingData.jitter;
      this.onProgress({
        stage: 'ping_complete',
        ping: results.ping,
        jitter: results.jitter,
        message: 'Ping test finished.'
      });

      await new Promise(r => setTimeout(r, 400));

      // Step 2: Download Speed Test
      this.onProgress({ stage: 'download', message: 'Testing Download Speed...', currentSpeed: 0 });
      const downloadData = await this.testDownloadSpeed();
      results.download = downloadData.speed;
      results.downloadPeak = downloadData.peak;
      this.onProgress({
        stage: 'download_complete',
        download: results.download,
        downloadPeak: results.downloadPeak,
        message: 'Download test finished.'
      });

      await new Promise(r => setTimeout(r, 400));

      // Step 3: Upload Speed Test
      this.onProgress({ stage: 'upload', message: 'Testing Upload Speed...', currentSpeed: 0 });
      const uploadData = await this.testUploadSpeed();
      results.upload = uploadData.speed;
      results.uploadPeak = uploadData.peak;
      this.onProgress({
        stage: 'upload_complete',
        upload: results.upload,
        uploadPeak: results.uploadPeak,
        message: 'Upload test finished.'
      });

      this.onProgress({
        stage: 'complete',
        results,
        message: 'Speed test completed successfully!'
      });

      return results;
    } catch (error) {
      console.error('Speed test error:', error);
      this.onProgress({ stage: 'error', error: error.message || 'Test failed' });
      throw error;
    }
  }

  /**
   * Ping & Jitter calculation over 10 rounds
   */
  async testPingAndJitter() {
    const samples = [];
    const count = 10;

    for (let i = 0; i < count; i++) {
      const start = performance.now();
      try {
        const res = await fetch(`/api/ip-info?t=${Date.now()}`, { cache: 'no-store' });
        await res.json();
      } catch (e) {
        // Fallback
      }
      const end = performance.now();
      const duration = Math.max(1, end - start);
      samples.push(duration);
      
      this.onProgress({
        stage: 'ping',
        ping: (samples.reduce((a, b) => a + b, 0) / samples.length).toFixed(1),
        currentSpeed: 0,
        progress: (i + 1) / count
      });
      await new Promise(r => setTimeout(r, 80));
    }

    const avgPing = samples.reduce((a, b) => a + b, 0) / samples.length;

    // Calculate Jitter (Mean Absolute Difference between consecutive pings)
    let totalDiff = 0;
    for (let i = 1; i < samples.length; i++) {
      totalDiff += Math.abs(samples[i] - samples[i - 1]);
    }
    const jitter = samples.length > 1 ? totalDiff / (samples.length - 1) : 0;

    return {
      ping: parseFloat(avgPing.toFixed(1)),
      jitter: parseFloat(jitter.toFixed(1))
    };
  }

  /**
   * Multi-thread Download speed test (streams 4 parallel workers over 6 seconds)
   */
  async testDownloadSpeed() {
    return new Promise(async (resolve) => {
      const startTime = performance.now();
      let totalBytesReceived = 0;
      let peakSpeed = 0;
      const testDurationMs = 6000;
      let isFinished = false;
      const speedsHistory = [];

      const interval = setInterval(() => {
        if (isFinished) return;
        const elapsedSec = (performance.now() - startTime) / 1000;
        if (elapsedSec <= 0) return;

        const currentSpeedMbps = (totalBytesReceived * 8) / (elapsedSec * 1000000);
        const roundedSpeed = parseFloat(currentSpeedMbps.toFixed(2));
        
        if (roundedSpeed > peakSpeed) peakSpeed = roundedSpeed;
        speedsHistory.push(roundedSpeed);

        this.onProgress({
          stage: 'download',
          currentSpeed: roundedSpeed,
          peakSpeed: peakSpeed,
          progress: Math.min(1, elapsedSec / (testDurationMs / 1000))
        });

        if (elapsedSec * 1000 >= testDurationMs) {
          isFinished = true;
          clearInterval(interval);
          const finalAvgSpeed = (speedsHistory.reduce((a, b) => a + b, 0) / Math.max(1, speedsHistory.length)) || currentSpeedMbps;
          resolve({
            speed: parseFloat(finalAvgSpeed.toFixed(2)),
            peak: parseFloat(peakSpeed.toFixed(2))
          });
        }
      }, 100);

      // Launch 4 parallel download workers for multi-thread accuracy
      const parallelWorkers = Array.from({ length: 4 }).map(async () => {
        try {
          const response = await fetch('/api/speedtest/download?size=25');
          const reader = response.body.getReader();
          while (!isFinished) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              totalBytesReceived += value.length;
            }
          }
        } catch (err) {
          // Stream error handler
        }
      });

      await Promise.all(parallelWorkers);

      if (!isFinished) {
        isFinished = true;
        clearInterval(interval);
        const elapsedSec = Math.max(0.1, (performance.now() - startTime) / 1000);
        const finalSpeed = (totalBytesReceived * 8) / (elapsedSec * 1000000);
        resolve({
          speed: parseFloat(finalSpeed.toFixed(2)),
          peak: parseFloat(Math.max(peakSpeed, finalSpeed).toFixed(2))
        });
      }
    });
  }

  /**
   * Multi-thread Upload speed test (4 parallel POST workers over 5 seconds)
   */
  async testUploadSpeed() {
    return new Promise(async (resolve) => {
      const startTime = performance.now();
      let totalBytesUploaded = 0;
      let peakSpeed = 0;
      const testDurationMs = 5000;
      let isFinished = false;
      const speedsHistory = [];

      const chunkData = new Uint8Array(2 * 1024 * 1024);
      for (let i = 0; i < chunkData.length; i++) {
        chunkData[i] = Math.floor(Math.random() * 256);
      }

      const interval = setInterval(() => {
        if (isFinished) return;
        const elapsedSec = (performance.now() - startTime) / 1000;
        if (elapsedSec <= 0) return;

        const currentSpeedMbps = (totalBytesUploaded * 8) / (elapsedSec * 1000000);
        const roundedSpeed = parseFloat(currentSpeedMbps.toFixed(2));
        
        if (roundedSpeed > peakSpeed) peakSpeed = roundedSpeed;
        speedsHistory.push(roundedSpeed);

        this.onProgress({
          stage: 'upload',
          currentSpeed: roundedSpeed,
          peakSpeed: peakSpeed,
          progress: Math.min(1, elapsedSec / (testDurationMs / 1000))
        });

        if (elapsedSec * 1000 >= testDurationMs) {
          isFinished = true;
          clearInterval(interval);
          const finalAvg = (speedsHistory.reduce((a, b) => a + b, 0) / Math.max(1, speedsHistory.length)) || currentSpeedMbps;
          resolve({
            speed: parseFloat(finalAvg.toFixed(2)),
            peak: parseFloat(peakSpeed.toFixed(2))
          });
        }
      }, 100);

      // Launch 3 parallel upload workers
      const parallelUploaders = Array.from({ length: 3 }).map(async () => {
        while (!isFinished) {
          try {
            await fetch('/api/speedtest/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/octet-stream' },
              body: chunkData
            });
            totalBytesUploaded += chunkData.length;
          } catch (e) {
            break;
          }
        }
      });

      await Promise.all(parallelUploaders);

      if (!isFinished) {
        isFinished = true;
        clearInterval(interval);
        const elapsedSec = Math.max(0.1, (performance.now() - startTime) / 1000);
        const finalSpeed = (totalBytesUploaded * 8) / (elapsedSec * 1000000);
        resolve({
          speed: parseFloat(finalSpeed.toFixed(2)),
          peak: parseFloat(Math.max(peakSpeed, finalSpeed).toFixed(2))
        });
      }
    });
  }
}
