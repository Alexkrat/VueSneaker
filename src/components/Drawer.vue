<script setup>
import CartItemList from "./CartItemList.vue";
import DrawerHead from "./DrawerHead.vue";
import InfoBlock from "./InfoBlock.vue";
import axios from "axios";
import { ref, computed, provide, inject } from "vue";

const isCreating = ref(false);

const props = defineProps({
  totalPrice: Number,
  vatPrice: Number,
  buttonDisabled: Boolean,
  drawerOpen: Boolean,
});
const { cart, closeDrawer } = inject("cart");
const orderId = ref(null);
const cartButtonDisabled = computed(() =>
  isCreating.value ? true : totalPrice.value ? false : true
);

const createOrder = async () => {
  try {
    isCreating.value = true;
    const { data } = await axios.post(
      "https://b7b411dfb5f14ebb.mokky.dev/orders",
      {
        items: cart.value,
        totalPrice: props.totalPrice.value,
      }
    );
    cart.value = [];
    orderId.value = data.id;
  } catch (err) {
    console.log(err);
  } finally {
    isCreating.value = false;
  }
};
</script>

<template>
  <div
    @click="closeDrawer"
    class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"
  ></div>
  <div v-auto-animate class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
    <DrawerHead />

    <div v-if="!totalPrice || orderId" class="flex h-full items-center">
      <InfoBlock
        v-if="!totalPrice && !orderId"
        title="Корзина пустая"
        description="Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
        image-url="/package-icon.png"
      />
      <InfoBlock
        v-if="orderId"
        title="Заказ оформлен!"
        :description="`Ваш заказ #${orderId} скоро будет передан курьерской доставке.`"
        image-url="/order-success-icon.png"
      />
    </div>
    <div v-else>
      <CartItemList />
      <div class="flex flex-col gap-4 mt-4">
        <div class="flex gap-2">
          <span>Итого:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ totalPrice }} руб.</b>
        </div>
        <div class="flex gap-2">
          <span>Налог 5%:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ vatPrice }} руб.</b>
        </div>
        <button
          @click="createOrder"
          :disabled="buttonDisabled"
          class="mt-4 transition bg-lime-500 w-full rounded-lg py-3 text-white disabled:bg-slate-300 hover:bg-lime-600 active:bg-lime-700 cursor-pointer"
        >
          Оформить заказ
        </button>
      </div>
    </div>
  </div>
</template>
