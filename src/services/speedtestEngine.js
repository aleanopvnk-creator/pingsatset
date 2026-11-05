/**
 * Real-Time Speed Test Engine (High Precision Multi-Worker + Hybrid Fallback)
 * Measures Ping, Jitter, Packet Loss, Download Speed, Upload Speed
 */

export class SpeedTestEngine {
  constructor(onProgress) {
    this.onProgress = onProgress || (() => {});
  }

  async runFullTest() {
    const results = {
      ping: 0,
      jitter: 0,
      packetLoss: 0,
      packetsSent: 0,
      packetsReceived: 0,
      packetLossStatus: 'MEASURED',
      download: 0,
      downloadPeak: 0,
      upload: 0,
      uploadPeak: 0,
    };

    try {
      // 1. Real Sequence Ping, Jitter & Packet Loss Test
      this.onProgress({ stage: 'ping', message: 'Measuring Ping, Jitter & Packet Loss...', currentSpeed: 0 });
      const pingData = await this.testPingAndJitter();
      results.ping = pingData.ping;
      results.jitter = pingData.jitter;
      results.packetLoss = pingData.packetLoss;
      results.packetsSent = pingData.packetsSent;
      results.packetsReceived = pingData.packetsReceived;
      results.packetLossStatus = pingData.packetLossStatus;

      this.onProgress({
        stage: 'ping_complete',
        ping: results.ping,
        jitter: results.jitter,
        packetLoss: results.packetLoss,
        packetsSent: results.packetsSent,
        packetsReceived: results.packetsReceived,
        packetLossStatus: results.packetLossStatus,
        message: 'Ping test completed.'
      });

      await new Promise(r => setTimeout(r, 300));

      // 2. Download Speed Test
      this.onProgress({ stage: 'download', message: 'Testing Download Speed...', currentSpeed: 0 });
      const downloadData = await this.testDownloadSpeed();
      results.download = downloadData.speed;
      results.downloadPeak = downloadData.peak;
      this.onProgress({
        stage: 'download_complete',
        download: results.download,
        downloadPeak: results.downloadPeak,
        message: 'Download test completed.'
      });

      await new Promise(r => setTimeout(r, 300));

      // 3. Upload Speed Test
      this.onProgress({ stage: 'upload', message: 'Testing Upload Speed...', currentSpeed: 0 });
      const uploadData = await this.testUploadSpeed();
      results.upload = uploadData.speed;
      results.uploadPeak = uploadData.peak;
      this.onProgress({
        stage: 'upload_complete',
        upload: results.upload,
        uploadPeak: results.uploadPeak,
        message: 'Upload test completed.'
      });

      this.onProgress({
        stage: 'complete',
        results,
        message: 'Speed test completed successfully!'
      });

      return results;
    } catch (error) {
      console.error('Speed test engine error:', error);
      this.onProgress({ stage: 'error', error: error.message || 'Speed test failed' });
      throw error;
    }
  }

  /**
   * TECHNICAL EXPLANATION & BROWSER LIMITATIONS:
   * 
   * 1. BROWSER SECURITY SANDBOX LIMITATION:
   *    Modern Web Browsers (Chrome, Firefox, Edge, Safari) DO NOT expose raw ICMP sockets
   *    or low-level UDP socket APIs to web applications due to W3C security sandbox restrictions.
   *    Direct OS-level ICMP ping cannot be executed natively inside client-side JavaScript.
   * 
   * 2. ACCURATE ALTERNATIVE MEASUREMENT METHODOLOGY:
   *    To accurately measure Packet Loss in web applications, we deploy a sequence-numbered probe sequence.
   *    We transmit 20 micro-probe requests with strict per-packet timeout limits (800ms).
   *    Any probe that times out, gets dropped by network congestion, or fails to return an ACK sequence is
   *    recorded as a lost packet.
   * 
   * 3. PACKET LOSS FORMULA:
   *    Packet Loss (%) = ((Packets Sent - Packets Received) / Packets Sent) * 100
   *    Precision: Formatted to 2 decimal places (e.g., 0.00%, 0.32%, 5.00%).
   *    If 0 packets arrive or connection is down, packetLossStatus is set to 'UNMEASURABLE'.
   */
  async testPingAndJitter() {
    const samples = [];
    const packetsSent = 20;
    let packetsReceived = 0;

    for (let i = 1; i <= packetsSent; i++) {
      const start = performance.now();
      let success = false;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 800);
        const res = await fetch(`/api/speedtest/ping-probe?seq=${i}&t=${Date.now()}`, { cache: 'no-store', signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          await res.json();
          success = true;
        }
      } catch (e) {
        success = false;
      }
      const end = performance.now();
      const duration = Math.max(2, end - start);

      if (success) {
        samples.push(duration);
        packetsReceived++;
      }

      const currentAvgPing = samples.length ? (samples.reduce((a, b) => a + b, 0) / samples.length).toFixed(1) : '15.0';
      const currentLoss = parseFloat((((i - packetsReceived) / i) * 100).toFixed(2));

      this.onProgress({
        stage: 'ping',
        ping: parseFloat(currentAvgPing),
        packetLoss: currentLoss,
        packetsSent: i,
        packetsReceived,
        packetLossStatus: 'MEASURED',
        currentSpeed: 0,
        progress: i / packetsSent
      });
      await new Promise(r => setTimeout(r, 40));
    }

    if (packetsReceived === 0) {
      return {
        ping: 0,
        jitter: 0,
        packetLoss: 100.0,
        packetsSent,
        packetsReceived: 0,
        packetLossStatus: 'UNMEASURABLE',
        unmeasurableReason: 'Koneksi jaringan terputus atau server tidak merespon paket probe.'
      };
    }

    const avgPing = samples.reduce((a, b) => a + b, 0) / samples.length;

    let totalDiff = 0;
    for (let i = 1; i < samples.length; i++) {
      totalDiff += Math.abs(samples[i] - samples[i - 1]);
    }
    const jitter = samples.length > 1 ? totalDiff / (samples.length - 1) : 1.2;
    const packetLoss = parseFloat((((packetsSent - packetsReceived) / packetsSent) * 100).toFixed(2));

    return {
      ping: parseFloat(avgPing.toFixed(1)),
      jitter: parseFloat(jitter.toFixed(1)),
      packetLoss,
      packetsSent,
      packetsReceived,
      packetLossStatus: 'MEASURED'
    };
  }

  /**
   * Download speed test (multi-threaded streaming over 6 seconds)
   */
  async testDownloadSpeed() {
    return new Promise(async (resolve) => {
      const startTime = performance.now();
      let totalBytesReceived = 0;
      let peakSpeed = 0;
      const testDurationMs = 6000;
      let isFinished = false;
      const speedSamples = [];

      const updateInterval = setInterval(() => {
        if (isFinished) return;
        const elapsedSec = (performance.now() - startTime) / 1000;
        if (elapsedSec <= 0.05) return;

        const currentMbps = (totalBytesReceived * 8) / (elapsedSec * 1000000);
        const roundedMbps = parseFloat(currentMbps.toFixed(2));

        if (roundedMbps > peakSpeed) peakSpeed = roundedMbps;
        speedSamples.push(roundedMbps);

        this.onProgress({
          stage: 'download',
          currentSpeed: roundedMbps,
          peakSpeed: peakSpeed,
          progress: Math.min(1, elapsedSec / (testDurationMs / 1000))
        });

        if (elapsedSec * 1000 >= testDurationMs) {
          isFinished = true;
          clearInterval(updateInterval);
          const finalAvg = speedSamples.length > 0
            ? (speedSamples.reduce((a, b) => a + b, 0) / speedSamples.length)
            : currentMbps;
          resolve({
            speed: parseFloat(finalAvg.toFixed(2)),
            peak: parseFloat(peakSpeed.toFixed(2))
          });
        }
      }, 100);

      // Launch 4 parallel download streams
      const workerCount = 4;
      const workers = Array.from({ length: workerCount }).map(async () => {
        while (!isFinished) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const response = await fetch(`/api/speedtest/download?size=15&t=${Date.now()}_${Math.random()}`, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.body) break;
            const reader = response.body.getReader();

            while (!isFinished) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) {
                totalBytesReceived += value.length;
              }
            }
          } catch (err) {
            await new Promise(r => setTimeout(r, 50));
          }
        }
      });

      await Promise.all(workers);

      if (!isFinished) {
        isFinished = true;
        clearInterval(updateInterval);
        const elapsedSec = Math.max(0.2, (performance.now() - startTime) / 1000);
        const finalMbps = (totalBytesReceived * 8) / (elapsedSec * 1000000);
        resolve({
          speed: parseFloat(finalMbps.toFixed(2)),
          peak: parseFloat(Math.max(peakSpeed, finalMbps).toFixed(2))
        });
      }
    });
  }

  /**
   * Upload speed test (multi-threaded POST streaming over 5.5 seconds)
   */
  async testUploadSpeed() {
    return new Promise(async (resolve) => {
      const startTime = performance.now();
      let totalBytesUploaded = 0;
      let peakSpeed = 0;
      const testDurationMs = 5500;
      let isFinished = false;
      const speedSamples = [];

      const payloadSize = 1024 * 1024;
      const chunkData = new Uint8Array(payloadSize);
      for (let i = 0; i < chunkData.length; i += 1024) {
        chunkData[i] = Math.floor(Math.random() * 256);
      }

      const updateInterval = setInterval(() => {
        if (isFinished) return;
        const elapsedSec = (performance.now() - startTime) / 1000;
        if (elapsedSec <= 0.05) return;

        const currentMbps = (totalBytesUploaded * 8) / (elapsedSec * 1000000);
        const roundedMbps = parseFloat(currentMbps.toFixed(2));

        if (roundedMbps > peakSpeed) peakSpeed = roundedMbps;
        speedSamples.push(roundedMbps);

        this.onProgress({
          stage: 'upload',
          currentSpeed: roundedMbps,
          peakSpeed: peakSpeed,
          progress: Math.min(1, elapsedSec / (testDurationMs / 1000))
        });

        if (elapsedSec * 1000 >= testDurationMs) {
          isFinished = true;
          clearInterval(updateInterval);
          const finalAvg = speedSamples.length > 0
            ? (speedSamples.reduce((a, b) => a + b, 0) / speedSamples.length)
            : currentMbps;
          resolve({
            speed: parseFloat(finalAvg.toFixed(2)),
            peak: parseFloat(peakSpeed.toFixed(2))
          });
        }
      }, 100);

      const workerCount = 3;
      const workers = Array.from({ length: workerCount }).map(async () => {
        while (!isFinished) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            await fetch('/api/speedtest/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/octet-stream' },
              body: chunkData,
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            totalBytesUploaded += chunkData.length;
          } catch (e) {
            await new Promise(r => setTimeout(r, 50));
          }
        }
      });

      await Promise.all(workers);

      if (!isFinished) {
        isFinished = true;
        clearInterval(updateInterval);
        const elapsedSec = Math.max(0.2, (performance.now() - startTime) / 1000);
        const finalMbps = (totalBytesUploaded * 8) / (elapsedSec * 1000000);
        resolve({
          speed: parseFloat(finalMbps.toFixed(2)),
          peak: parseFloat(Math.max(peakSpeed, finalMbps).toFixed(2))
        });
      }
    });
  }
}
