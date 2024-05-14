<script setup>
import { reactive, ref, onMounted, inject, watch } from "vue";
import axios from "axios";
import CardList from "../components/CardList.vue";
import debounce from "lodash.debounce";
const items = ref([]);

const { cart, addToCart, removeFromCart } = inject("cart");

const filters = reactive({
  sortBy: "title",
  searchQuery: "",
});

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        parentId: item.id,
        item,
      };
      item.isFavorite = true;
      const { data } = await axios.post(
        "https://b7b411dfb5f14ebb.mokky.dev/favorites",
        obj
      );

      item.favoriteId = data.id;
    } else {
      item.isFavorite = false;
      await axios.delete(
        `https://b7b411dfb5f14ebb.mokky.dev/favorites/${item.favoriteId}`
      );

      item.favoriteId = null;
    }
  } catch (err) {
    console.log(err);
  }
};

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value;
};
const onChangeSearchInput = debounce((event) => {
  filters.sortQuery = event.target.value;
}, 500);
const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item);
  } else {
    removeFromCart(item);
  }
};

const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy,
    };

    if (filters.sortQuery) {
      params.title = `*${filters.sortQuery}*`;
    }
    const { data } = await axios.get(
      "https://b7b411dfb5f14ebb.mokky.dev/items",
      {
        params,
      }
    );
    items.value = data.map((obj) => ({
      ...obj,
      isFavorite: false,
      favoriteId: null,
      isAdded: false,
    }));
  } catch (err) {
    console.log(err);
  }
};
//fav.id !!!(==) item.id
const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(
      "https://b7b411dfb5f14ebb.mokky.dev/favorites"
    );
    items.value = items.value.map((item) => {
      const favorite = favorites.find(
        (favorite) => favorite.parentId === item.id
      );

      if (!favorite) {
        return item;
      }
      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id,
      };
    });
    console.log(items.value);
  } catch (err) {
    console.log(err);
  }
};
onMounted(async () => {
  const localCart = localStorage.getItem("cart");
  cart.value = localCart ? JSON.parse(localCart) : [];

  await fetchItems();
  await fetchFavorites();

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id),
  }));
});

watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false,
  }));
});

watch(filters, fetchItems);
</script>

<template>
  <div class="p-10">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>
      <div class="flex gap-4">
        <select
          @change="onChangeSelect"
          class="py-2 px-3 border rounded-md outline-none"
        >
          <option value="name">По названию</option>
          <option value="price">По цене (дешевые)</option>
          <option value="-price">По цене (дорогие)</option>
        </select>
        <div class="relative">
          <img class="absolute left-3 top-3" src="/search.svg" />
          <input
            @input="onChangeSearchInput"
            class="border rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
            placeholder="Поиск..."
          />
        </div>
      </div>
    </div>

    <div class="mt-10">
      <CardList
        :items="items"
        @add-to-favorite="addToFavorite"
        @add-to-cart="onClickAddPlus"
      />
    </div>
  </div>
</template>
