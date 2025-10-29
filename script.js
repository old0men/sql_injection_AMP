document.addEventListener('DOMContentLoaded', () => {
    const sqlQuery = document.getElementById('sqlQuery');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const check = document.getElementById('check');

    check.addEventListener('click', () => {
        sqlQuery.innerText = `SELECT * FROM user WHERE name = '${username.value}' AND password = '${password.value}'`;
    });
});