<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" class="show-on-mobile" />
        <q-toolbar-title>
          Weather App
          <q-toggle v-model="darkMode" checked-icon="dark_mode" color="blue" unchecked-icon="light_mode" />
        </q-toolbar-title>
        <div class="hide-on-mobile flex items-center">
          <q-btn flat icon="home" label="Home" to="/" />
          <q-btn flat icon="assignment" label="Tugas1" href="https://tugas1-pbk-223510675.vercel.app/?authuser=0"
            target="_blank" />
          <q-btn flat icon="assignment" label="Tugas2" href="https://hammam-223510675-chat-app.vercel.app/?authuser=0"
            target="_blank" />
          <q-btn flat icon="assignment" label="Tugas3" href="https://crudpbk-hammam.vercel.app/?authuser=0"
            target="_blank" />
          <q-btn flat icon="assignment" label="Tugas4" href="https://prakpbk4-seven.vercel.app/?authuser=0"
            target="_blank" />
          <q-btn flat icon="assignment" label="Tugas5" href="https://prakpbk5-hammam-223510675.vercel.app/?authuser=0"
            target="_blank" />
          <q-btn flat icon="assignment" label="Tugas6" href="https://hammam-225310675-prak6.vercel.app/"
            target="_blank" />
          <q-btn flat icon="assignment" label="Tugas7" href="https://tugas7-hammam-223510675.vercel.app/?authuser=0"
            target="_blank" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" side="left" overlay behavior="mobile">
      <q-list>
        <q-item clickable to="/" class="q-pa-md">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Home</q-item-section>
        </q-item>
        <q-item clickable href="https://tugas1-pbk-223510675.vercel.app/?authuser=0" target="_blank" class="q-pa-md">
          <q-item-section avatar><q-icon name="assignment" /></q-item-section>
          <q-item-section>Tugas1</q-item-section>
        </q-item>
        <q-item clickable href="https://hammam-223510675-chat-app.vercel.app/?authuser=0" target="_blank" class="q-pa-md">
          <q-item-section avatar><q-icon name="assignment" /></q-item-section>
          <q-item-section>Tugas2</q-item-section>
        </q-item>
        <q-item clickable href="https://crudpbk-hammam.vercel.app/?authuser=0" target="_blank" class="q-pa-md">
          <q-item-section avatar><q-icon name="assignment" /></q-item-section>
          <q-item-section>Tugas3</q-item-section>
        </q-item>
        <q-item clickable href="https://prakpbk4-seven.vercel.app/?authuser=0" target="_blank" class="q-pa-md">
          <q-item-section avatar><q-icon name="assignment" /></q-item-section>
          <q-item-section>Tugas4</q-item-section>
        </q-item>
        <q-item clickable href="https://prakpbk5-hammam-223510675.vercel.app/?authuser=0" target="_blank" class="q-pa-md">
          <q-item-section avatar><q-icon name="assignment" /></q-item-section>
          <q-item-section>Tugas5</q-item-section>
        </q-item>
        <q-item clickable href="https://hammam-225310675-prak6.vercel.app/" target="_blank" class="q-pa-md">
          <q-item-section avatar><q-icon name="assignment" /></q-item-section>
          <q-item-section>Tugas6</q-item-section>
        </q-item>
        <q-item clickable href="https://tugas7-hammam-223510675.vercel.app/?authuser=0" target="_blank" class="q-pa-md">
          <q-item-section avatar><q-icon name="assignment" /></q-item-section>
          <q-item-section>Tugas7</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Dark } from 'quasar';

export default {
  name: 'MainLayout',
  setup() {
    const drawer = ref(false);
    const darkMode = ref(localStorage.getItem('darkMode') === 'true');

    // Watch darkMode and apply Dark.set whenever it changes
    watch(darkMode, (newValue) => {
      Dark.set(newValue);
      localStorage.setItem('darkMode', newValue);
    });

    // Set dark mode initially based on the stored value
    onMounted(() => {
      Dark.set(darkMode.value);
    });

    return {
      drawer,
      darkMode,
    };
  }
};
</script>

<style>
.hide-on-mobile {
  display: none;
}

@media (min-width: 794px) {
  .hide-on-mobile {
    display: inline-block;
  }

  .show-on-mobile {
    display: none;
  }
}
</style>
