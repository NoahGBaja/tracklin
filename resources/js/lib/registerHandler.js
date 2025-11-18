export const submitRegister = async (formData) => {
    if (formData.password !== formData.ReenterPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        // Replace with your actual API call
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            }),
        });

        if (!response.ok) throw new Error("Failed to register");

        alert("Registration successful!");
    } catch (error) {
        console.error(error);
        alert("Registration failed, please try again.");
    }
};
