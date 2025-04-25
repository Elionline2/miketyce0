// Password protection for CMS access
function checkPassword() {
    const password = prompt('Please enter the password to access the CMS:');
    const correctPassword = 'admin123'; // You should change this to a more secure password
    
    if (password === correctPassword) {
        window.location.href = 'cms.html';
    } else {
        alert('Incorrect password. Please try again.');
    }
} 