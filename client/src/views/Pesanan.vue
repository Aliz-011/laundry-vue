<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 mt-10">
    {{ errMsg }}
    <div>
      <PesananTable :data="data" />
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import supabase from "../supabase/supabase";
import PesananTable from "../components/PesananTable.vue";
import PesanModal from "../components/PesanModal.vue";

export default {
  name: "Pesanan",
  components: {
    PesananTable,
    PesanModal,
  },
  setup() {
    const data = ref([]);
    const errMsg = ref(null);

    const getData = async () => {
      try {
        let { data: pesanan, error } = await supabase
          .from("pesanan")
          .select(
            `
            id,
            berat,
            status,
            paket:paket_id (
                nama,
                durasi,
                harga
            )
        `
          )
          .order("created_at", { ascending: true });
        data.value = pesanan;
        if (error) throw error;
      } catch (error) {
        errMsg.value = error.message;
        setTimeout(() => {
          errMsg.value = null;
        }, 5000);
      }
    };

    getData();

    return { data, errMsg };
  },
};
</script>

<style></style>
