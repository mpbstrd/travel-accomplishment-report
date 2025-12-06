// User mapping - same as submit-report.js for consistency
const userMapping = {
    'john-doe': {
        id: 'user-001',
        uuid: '11111111-1111-4111-8111-111111111111',
        name: 'John Doe',
        role: 'Branch Manager'
    },
    'jane-smith': {
        id: 'user-002',
        uuid: '22222222-2222-4222-8222-222222222222',
        name: 'Jane Smith', 
        role: 'Branch Staff'
    },
    'bob-johnson': {
        id: 'user-003',
        uuid: '33333333-3333-4333-8333-333333333333',
        name: 'Bob Johnson',
        role: 'NISD Staff'
    },
    'admin': {
        id: 'admin',
        uuid: '44444444-4444-4444-8444-444444444444',
        name: 'System Administrator',
        role: 'Administrator'
    },
    'test-user': {
        id: 'test-user',
        uuid: '55555555-5555-4555-8555-555555555555',
        name: 'Test User',
        role: 'Test Role'
    }
};

// Get the appropriate user ID based on environment
function getUserId(userKey) {
    const user = userMapping[userKey];
    if (!user) return null;
    
    // Always use UUID format for better compatibility
    return user.uuid;
}

// Auto-fill signatory name when user is selected
document.getElementById('userId').addEventListener('change', function() {
    const selectedUser = this.value;
    const signatoryNameInput = document.getElementById('signatoryName');
    
    if (selectedUser && userMapping[selectedUser]) {
        signatoryNameInput.value = userMapping[selectedUser].name;
    }
});

document.getElementById('signatureForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const reportId = document.getElementById('reportId').value;
    const signatureType = document.getElementById('signatureType').value;
    const signatoryName = document.getElementById('signatoryName').value;
    const selectedUser = document.getElementById('userId').value;
    const disclaimerAcknowledged = document.getElementById('disclaimerAcknowledged').checked;
    
    // Get the mapped user ID
    const userId = getUserId(selectedUser);
    if (!userId) {
        alert('Please select a valid user');
        return;
    }
    
    const responseSection = document.getElementById('responseSection');
    const responseTitle = document.getElementById('responseTitle');
    const responseContent = document.getElementById('responseContent');
    
    responseSection.className = 'response-section show';
    responseSection.classList.remove('success', 'error');
    responseTitle.textContent = 'Recording signature...';
    responseContent.textContent = 'Please wait...';
    
    try {
        const response = await fetch(`/api/reports/${reportId}/signatures`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTAwMiIsImVtYWlsIjoiamFuZS5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTc2NDk4NDk5NCwiZXhwIjoxNzY1MDcxMzk0fQ.bdhWc69nksvK_3Kpn0fP_DFY8hbMOXlc8duPokKP_7E'
            },
            body: JSON.stringify({
                signatureType,
                signatoryName,
                disclaimerAcknowledged,
                userId
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            responseSection.classList.add('success');
            responseTitle.textContent = '✅ Signature Recorded!';
            responseContent.textContent = JSON.stringify(data, null, 2);
            console.log('Signature response:', data);
            
            // Show user info in response
            const user = userMapping[selectedUser];
            console.log(`Signature recorded by: ${user.name} (${user.role}) - ID: ${userId}`);
            
            // Reset form
            document.getElementById('signatureForm').reset();
        } else {
            responseSection.classList.add('error');
            responseTitle.textContent = '❌ Error';
            responseContent.textContent = JSON.stringify(data, null, 2);
            console.error('Signature error:', data);
        }
    } catch (error) {
        responseSection.classList.add('error');
        responseTitle.textContent = '❌ Network Error';
        responseContent.textContent = error.message;
        console.error('Network error:', error);
    }
});