<template>
  <div class="min-h-full box-border" v-if="appReady">
    <Navigation :user="user" />
    <router-view />
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import Navigation from "./components/Navigation.vue";
import supabase from "./supabase/supabase";
export default {
  components: { Navigation },
  setup() {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = process.env.MIDTRANS_CLIENT_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);

    // Create data / vars
    const appReady = ref(null);
    const store = useStore();

    // Check to see if user is already logged in
    const user = supabase.auth.user();

    // If user does not exist, need to make app ready
    if (!user) {
      appReady.value = true;
    }

    // Runs when there is a auth state change
    // if user is logged in, this will fire
    supabase.auth.onAuthStateChange((_, session) => {
      store.commit("setUser", session);
      appReady.value = true;
    });

    return { appReady, user };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
