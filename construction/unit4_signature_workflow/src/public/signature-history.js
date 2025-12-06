document.getElementById('historyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const reportId = document.getElementById('reportId').value;
    
    const responseSection = document.getElementById('responseSection');
    const responseTitle = document.getElementById('responseTitle');
    const responseContent = document.getElementById('responseContent');
    
    responseSection.className = 'response-section show';
    responseSection.classList.remove('success', 'error');
    responseTitle.textContent = 'Fetching history...';
    responseContent.textContent = 'Please wait...';
    
    try {
        const response = await fetch(`/api/reports/${reportId}/signatures/history`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTAwMiIsImVtYWlsIjoiamFuZS5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTc2NDk4NDk5NCwiZXhwIjoxNzY1MDcxMzk0fQ.bdhWc69nksvK_3Kpn0fP_DFY8hbMOXlc8duPokKP_7E'
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            responseSection.classList.add('success');
            responseTitle.textContent = '✅ History Retrieved';
            
            // Format the response for better readability
            if (data.success && data.data && data.data.signatures) {
                const signatures = data.data.signatures;
                if (signatures.length === 0) {
                    responseContent.textContent = 'No signatures found for this report.';
                } else {
                    let formattedOutput = `Found ${signatures.length} signature(s):\n\n`;
                    signatures.forEach((sig, index) => {
                        formattedOutput += `${index + 1}. ${sig.signatureType}\n`;
                        formattedOutput += `   Signatory: ${sig.signatoryName}\n`;
                        formattedOutput += `   Signed At: ${new Date(sig.signedAt).toLocaleString()}\n`;
                        formattedOutput += `   User ID: ${sig.signatoryUserId}\n\n`;
                    });
                    formattedOutput += '\nFull Response:\n' + JSON.stringify(data, null, 2);
                    responseContent.textContent = formattedOutput;
                }
            } else {
                responseContent.textContent = JSON.stringify(data, null, 2);
            }
            
            console.log('History response:', data);
        } else {
            responseSection.classList.add('error');
            responseTitle.textContent = '❌ Error';
            responseContent.textContent = JSON.stringify(data, null, 2);
            console.error('History error:', data);
        }
    } catch (error) {
        responseSection.classList.add('error');
        responseTitle.textContent = '❌ Network Error';
        responseContent.textContent = error.message;
        console.error('Network error:', error);
    }
});