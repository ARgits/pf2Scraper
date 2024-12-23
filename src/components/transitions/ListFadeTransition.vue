<script setup lang="ts">

</script>
<template>
  <TransitionGroup name="list-fade">
    <slot />
  </TransitionGroup>
</template>
<style lang="scss">
.list-fade {
    &-enter-active {
        animation: fade .5s;
    }

    &-leave-active {
        transition: fade .5s reverse;
    }

    @keyframes fade {
        0% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }
}
</style>