// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbxLtGd_RsGvsLrEvtDHsbaeEq7YnLzn8GzDV3UAQaEKESODls8UJQX70p-rJbKSfSXE/exec?action=getData';
  
  try {
    const response = await fetch(scriptUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Received data is not an array');
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
