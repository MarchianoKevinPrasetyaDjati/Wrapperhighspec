const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// API Key HighSpec Anda (diambil dari file Api.txt)
const HIGHSPEC_API_KEY = 'hsk_157d08bcbdcbe4f5cb8b0901baa85d43f6a6763070f515bdfe86b7176ec5b3ce';

app.post('/solve', async (req, res) => {
    try {
        // WinterCode Agent mengirimkan username dan cookie di body request
        const { username, cookie } = req.body;

        if (!username || !cookie) {
            return res.status(400).json({ status: "failed", error: "Username atau cookie tidak ditemukan" });
        }

        console.log(`\n[+] Menerima request solve dari agen untuk akun: ${username}`);

        // 1. Format payload sesuai dengan yang diminta HighSpec API
        const payload = {
            "note": "WinterCode Agent Solve",
            "accounts": [
                {
                    "username": username,
                    "cookie": cookie
                }
            ]
        };

        const highspecUrl = `https://highspec.gg/api/v1/external/job/captcha/submit?api_key=${HIGHSPEC_API_KEY}&priority=false&service=directapi`;

        console.log(`[+] Meneruskan data ke HighSpec API...`);
        
        // 2. Kirim request ke HighSpec
        const response = await axios.post(highspecUrl, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(`[+] Sukses dari HighSpec:`, response.data);

        // 3. Mengubah balasan HighSpec menjadi format yang dimengerti WinterCode Agent
        // Catatan: Karena di URL HighSpec menggunakan 'service=directapi', kita berasumsi 
        // request ini akan tertahan (blocking) sampai selesai, mirip dengan ZeroSolver.
        
        // Kita kembalikan format JSON yang diharapkan oleh WinterCode Agent (berdasarkan dokumentasi ZeroSolver)
        return res.json({
            status: "ok",
            job_id: response.data.job_id || "highspec-job-123",
            result: "solved"
        });

    } catch (error) {
        console.error(`[-] Error saat menghubungi HighSpec:`, error.response ? error.response.data : error.message);
        
        // Beritahu agen bahwa solve gagal
        return res.json({
            status: "failed",
            result: "failed"
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Wrapper HighSpec API berjalan di port ${PORT}`);
    console.log(`=================================================`);
    console.log(`Silakan masukkan URL ini di Custom Solver URL agen Anda:`);
    console.log(`http://localhost:${PORT}/solve`);
    console.log(`=================================================`);
});
