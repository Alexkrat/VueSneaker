<script setup>
import { onMounted, ref } from "vue";
import CardList from "../components/CardList.vue";
import axios from "axios";

const favorites = ref([]);

onMounted(async () => {
  try {
    const { data } = await axios.get(
      "https://b7b411dfb5f14ebb.mokky.dev/favorites"
    );
    favorites.value = data.map((obj) => obj.item);
  } catch (err) {
    console.log(err);
  }
});
</script>

<template>
  <div class="p-10">
    <h2 class="text-3xl font-bold mb-8">Мои закладки</h2>
    <CardList :items="favorites" is-favorites />
  </div>
</template>
