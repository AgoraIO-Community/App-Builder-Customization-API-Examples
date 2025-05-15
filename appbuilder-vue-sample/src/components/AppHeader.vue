<template>
  <header class="app-header">
    <div class="logo">🩺 HealthConnect</div>
    <nav>
      <a href="#">Home</a>
      <a href="#">Appointments</a>
      <a href="#">Contact</a>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 10;
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2a9d8f;
}
nav a {
  margin-left: 1.5rem;
  color: #333;
  text-decoration: none;
  font-weight: 500;
}
nav a:hover {
  color: #2a9d8f;
}
</style>
