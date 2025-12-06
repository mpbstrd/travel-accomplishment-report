document.getElementById('submitForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const reportId = document.getElementById('reportId').value;
    const userId = document.getElementById('userId').value;
    const responseSection = document.getElementById('responseSection');
    const responseTitle = document.getElementById('responseTitle');
    const responseContent = document.getElementById('responseContent');
    
    // Show loading state
    responseSection.className = 'response-section show';
    responseSection.classList.remove('success', 'error');
    responseTitle.textContent = 'Submitting...';
    responseContent.textContent = 'Please wait...';
    
    try {
        const response = await fetch(`/api/reports/${reportId}/signatures/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer mock-jwt-token'
            },
            body: JSON.stringify({ userId })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            responseSection.classList.add('success');
            responseTitle.textContent = '✅ Success!';
            responseContent.textContent = JSON.stringify(data, null, 2);
            console.log('Submit response:', data);
        } else {
            responseSection.classList.add('error');
            responseTitle.textContent = '❌ Error';
            responseContent.textContent = JSON.stringify(data, null, 2);
            console.error('Submit error:', data);
        }
    } catch (error) {
        responseSection.classList.add('error');
        responseTitle.textContent = '❌ Network Error';
        responseContent.textContent = error.message;
        console.error('Network error:', error);
    }
});
