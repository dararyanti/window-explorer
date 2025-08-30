<template>
  <div class="app-container d-flex flex-column vh-100 bg-light">
    <!-- Top Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link :to="{ name: 'home' }" class="navbar-brand">Windows Explorer</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
          aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>

    <!--- render router view -->
    <router-view />
     <div class="footer-watermark">
      &copy; Dara Ryanti
    </div>

  </div>
</template>
<style scoped>

.app-container {
  position: relative; /* for absolute positioning of footer watermark */
  flex: 1;
}

.footer-watermark {
  position: absolute;
  bottom: 10px;
  right: 15px;
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.4); /* subtle/translucent */
  user-select: none;
  pointer-events: none; /* doesn't block clicks */
}
</style>