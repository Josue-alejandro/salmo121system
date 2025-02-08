<script setup>
</script>

<template>
    <div>
      <nav>
        <div class="nav-wrapper navigationBar">
          <ul class="right">
            <li><a href="#">Inventario</a></li>
            <li><a href="#">Registro</a></li>
            <li><a href="#">Empleados</a></li>
            <li><a href="#">Proveedores</a></li>
          </ul>
        </div>
      </nav>
    </div>
    <router-view></router-view>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.navigationBar{
  background-color: #213547;
}
</style>
