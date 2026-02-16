<template>
  <div class="home-view">
  <div>
    <nav class="navbar navbar-dark sticky-top flex-md-nowrap p-0">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Brzojav</a>
      <input class="form-control form-control-dark w-100" type="text" placeholder="Search contacts..." aria-label="Search">
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a class="nav-link" href="#">Sign out</a>
        </li>
      </ul>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <nav class="sidebar">
          <div class="sidebar-sticky">
            <!-- TOP ITEMS -->
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" href="#">
                  <svg class="feather feather-home">...</svg>
                  Brzojav
                </a>
              </li>

              <li class="nav-item">
                <a class="nav-link" href="#">
                  <svg class="feather feather-shopping-cart">...</svg>
                  Products
                </a>
              </li>
            </ul>

            <!-- BOTTOM ITEMS -->
            <div class="mt-auto">
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mb-1 text-muted">
                <button>Helo</button>
              </h6>
            </div>
          </div> <!-- .sidebar-sticky -->
        </nav> <!-- .sidebar -->
      </div> <!-- .row -->
    </div> <!-- .container-fluid -->
  </div> <!-- root div -->
</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>
<style scoped>
.home-view {
  background-color: rgb(87, 61, 61);
  min-height: 100vh; /* ensures the background fills the screen */
  font-size: .875rem;
  color: #fff; /* optional, to match your theme */
}

.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 0;
  width: 60px;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
  background-color: rgb(131, 40, 40);
}

.sidebar-sticky {
  position: sticky;
  top: 48px;
  height: calc(100vh - 48px);
  padding-top: .5rem;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link .feather {
  margin-right: 4px;
  color: #999;
}

.sidebar .nav-link.active {
  color: #007bff;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
  color: inherit;
}

.sidebar-heading {
  font-size: .75rem;
  text-transform: uppercase;
}

.navbar {
  background-color: rgb(131, 40, 40);
}


.navbar-brand {
  padding-top: .75rem;
  padding-bottom: .75rem;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, .25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
}

.navbar .form-control {
  padding: .75rem 1rem;
  border-width: 0;
  border-radius: 0;
}

.form-control-dark {
  color: #fff;
  background-color: rgba(255, 255, 255, .1);
  border-color: rgba(255, 255, 255, .1);
}

.form-control-dark:focus {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: transparent;
  box-shadow: none;
}

.border-bottom {
  border-bottom: 1px solid #e5e5e5;
}

main {
  margin-left: 80px;
}

.navbar .navbar-brand,
.navbar .nav-link,
.navbar input {
  color: #f2f2f2;
}

.navbar .form-control::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

</style>