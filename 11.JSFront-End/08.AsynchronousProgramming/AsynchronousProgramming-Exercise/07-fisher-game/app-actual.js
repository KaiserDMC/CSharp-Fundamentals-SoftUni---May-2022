// This should be the actual solution of the problem, however it will only give you somewhere between 50 and 85 points in Judge.
// For 3 of the tests the improper field names are used for the requests.
// They check the register form inputs during login request, which is wrong.
// This results in tests 2, 3 and 4 failing.

// Furthermore, the access token and the catch id are hardcoded, without it ever being mentioned in the task.
// If you don't hardcode the id and the token, tests 6 and 8 will fail.

// In addition to that, if you don't use async/await syntax in update and delete handlers, tests 13 and 14 will fail with timeout.

// The only way to get 100 points is to use the app.js file, which is the solution that the Judge expects.

async function solve() {
    const baseLoginUrl = "http://localhost:3030/users/login";
    const baseLogoutUrl = "http://localhost:3030/users/logout";
    const baseRegisterUrl = "http://localhost:3030/users/register";
    const baseCatchesUrl = "http://localhost:3030/data/catches";
    const loginButton = document.querySelector("#login button");
    const registerButton = document.querySelector("#register button");
    const userNavigation = document.getElementById("user");
    const guestNavigation = document.getElementById("guest");
    const userGreeting = document.querySelector("nav p span");
    const logoutBtn = document.querySelector("nav #user #logout");
    const addBtn = document.querySelector("button.add");
    const loadButton = document.querySelector("button.load");
    const catchesDiv = document.querySelector("#catches");
    catchesDiv.id = "";

    if (sessionStorage.getItem("isLogged") === "true") {
        userNavigation.style.display = "inline";
        guestNavigation.style.display = "none";
        userGreeting.textContent = sessionStorage.getItem("email");
        addBtn.removeAttribute("disabled");
    } else {
        userNavigation.style.display = "none";
        guestNavigation.style.display = "inline";
        userGreeting.textContent = "guest";
        addBtn.setAttribute("disabled", "");
    }

    loginButton.addEventListener("click", userLogin);
    registerButton.addEventListener("click", userRegister);
    logoutBtn.addEventListener("click", userLogout);
    addBtn.addEventListener("click", addHandler);
    loadButton.addEventListener("click", loadCatches);
    
    async function userRegister() {
        const form = document.querySelector("#register-view > form");
        const emailInput = form.querySelector('input[name="email"]');
        const passwordInput = form.querySelector('input[name="password"]');
        const rePasswordInput = form.querySelector('input[name="rePass"]');
        const notificationField = form.querySelector(".notification");
        notificationField.textContent = "";

        if (passwordInput.value === rePasswordInput.value) {
            const user = {
                username: emailInput.value,
                password: passwordInput.value
            }

            try {
                const response = await fetch(`${baseRegisterUrl}`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({user})
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log("Registration successful");
            } catch (error) {
                console.error("Error during registration:", error);
                notificationField.textContent = "Error! Please try again.";
            }
        } else {
            notificationField.textContent = "Password does not match!";
        }
    }

    async function userLogin() {
        const form = document.querySelector("#login-view > form");
        const emailInput = form.querySelector('input[type="text"]');
        const passwordInput = form.querySelector('input[type="password"]');
        const notificationField = form.querySelector(".notification");
        notificationField.textContent = "";

        const user = {
            username: emailInput.value,
            password: passwordInput.value
        };

        try {
            const response = await fetch(`${baseLoginUrl}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({user})
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log("Login successful");

            sessionStorage.setItem("isLogged", true);
            sessionStorage.setItem("email", data.email);
            sessionStorage.setItem("password", data.value);
            sessionStorage.setItem("userId", data._id);
            sessionStorage.setItem("accessToken", data.accessToken);

            solve();
        } catch (error) {
            console.error("Error during login:", error);
            notificationField.textContent = "Invalid username or password.";
        }
    }

    async function userLogout() {
        sessionStorage.clear();

        await fetch(`${baseLogoutUrl}`, {
            method: "GET",
            email: sessionStorage.getItem("email"),
            password: sessionStorage.getItem("password"),
            headers: {"X-Authorization": sessionStorage.getItem("accessToken")}
        });

        solve();
    }

    async function loadCatches() {
        catchesDiv.id = "catches";

        let updateButtons = Array.from(document.querySelectorAll("button.update"));
        let deleteButtons = Array.from(document.querySelectorAll("button.delete"));
        updateButtons.forEach(b => b.addEventListener("click", (event) => handleUpdate(event)));
        deleteButtons.forEach(b => b.addEventListener("click", (event) => handleDelete(event)));
    }

    async function addHandler() {
        const requestBody = JSON.stringify({
            angler: document.querySelector("#addForm input.angler").value,
            weight: document.querySelector("#addForm input.weight").value,
            species: document.querySelector("#addForm input.species").value,
            location: document.querySelector("#addForm input.location").value,
            bait: document.querySelector("#addForm input.bait").value,
            captureTime: document.querySelector("#addForm input.captureTime").value,
        });

        const request = await fetch(baseCatchesUrl, {
            method: "POST",
            headers: {
                "x-authorization": sessionStorage.getItem("accessToken")
            },
            body: requestBody
        })
    }

    async function handleUpdate(event) {
        const target = event.currentTarget;
        const id = target.dataset.id;
        const catchDiv = target.parentElement;
        
        const requestBody = JSON.stringify({
            angler: catchDiv.querySelector("input.angler").value,
            weight: catchDiv.querySelector("input.weight").value,
            species: catchDiv.querySelector("input.species").value,
            location: catchDiv.querySelector("input.location").value,
            bait: catchDiv.querySelector("input.bait").value,
            captureTime: catchDiv.querySelector("input.captureTime").value,
        });
        const response = await fetch(baseCatchesUrl + id, {
            method: "PUT",
            headers: {
                "X-Authorization": sessionStorage.getItem("accessToken")
            },
            body: requestBody
        })
    }

    async function handleDelete(event) {
        const target = event.currentTarget;
        const id = target.dataset.id;
        
        const response = await fetch(baseCatchesUrl + id, {
            method: "DELETE",
            headers: {
                "x-authorization": sessionStorage.getItem("accessToken")
            }
        })
    }
}

solve();