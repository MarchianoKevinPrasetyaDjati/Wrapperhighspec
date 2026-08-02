const axios = require('axios');

// API Key HighSpec Anda (diambil dari file Api.txt)
const HIGHSPEC_API_KEY = 'hsk_157d08bcbdcbe4f5cb8b0901baa85d43f6a6763070f515bdfe86b7176ec5b3ce';

module.exports = async (req, res) => {
    // Memastikan hanya menerima request berjenis POST
    if (req.method !== 'POST') {
        return res.status(405).json({ status: "failed", error: "Hanya menerima method POST" });
    }

    try {
        // WinterCode Agent mengirimkan username dan cookie di body request
        const { username, cookie } = req.body;

        if (!username || !cookie) {
            return res.status(400).json({ status: "failed", error: "Username atau cookie tidak ditemukan" });
        }

        console.log(`[+] Menerima request solve untuk akun: ${username}`);

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
        
        // 2. Kirim request ke HighSpec
        const response = await axios.post(highspecUrl, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // 3. Mengubah balasan HighSpec menjadi format yang dimengerti WinterCode Agent
        return res.json({
            status: "ok",
            job_id: response.data && response.data.job_id ? response.data.job_id : "highspec-job-123",
            result: "solved"
        });

    } catch (error) {
        console.error(`[-] Error:`, error.response ? error.response.data : error.message);
        return res.json({
            status: "failed",
            result: "failed"
        });
    }
};
