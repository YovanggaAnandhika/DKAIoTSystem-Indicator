import { exec } from 'child_process';
import IoT from '@dkaarmbian/iot';

const STB = new IoT.s905x.HG680P();

function getEth0Speed(callback: (speed: number) => void): void {
    exec('ethtool eth0 | grep \'Speed:\'', (error, stdout) => {
        if (error) {
            console.error(`Error executing ethtool: ${error}`);
            return;
        }
        const speedMatch = stdout.match(/Speed: (\d+)Mb\/s/);
        if (speedMatch) {
            callback(parseInt(speedMatch[1], 10));
        } else {
            console.error('Could not determine speed from ethtool output.');
        }
    });
}

function blinkLan(speed: number): void {
    if (speed >= 1000) {
        // Cepat berkedip jika kecepatan tinggi
        STB.lan('on');
        setTimeout(() => STB.lan('dis'), 100); // Berkedip setiap 100 ms
    } else if (speed >= 100) {
        // Berkedip sedang jika kecepatan menengah
        STB.lan('on');
        setTimeout(() => STB.lan('dis'), 500); // Berkedip setiap 500 ms
    } else {
        // Berkedip lambat jika kecepatan rendah
        STB.lan('on');
        setTimeout(() => STB.lan('dis'), 1000); // Berkedip setiap 1000 ms
    }
}

// Update kecepatan interface setiap 2 detik
setInterval(() => {
    getEth0Speed((speed) => {
        blinkLan(speed);
    });
}, 2000);

// Awal, matikan semuanya
STB.power('dis');
STB.ir('off');
STB.lan('dis');
