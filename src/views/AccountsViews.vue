<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Пользователи
        </q-toolbar-title>

        <q-btn flat round dense icon="person" to="/accounts">
          <q-tooltip> Аккаунты</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script lang="ts">
export default {
  name: 'AccountsViews',
};
</script>

<style>

</style>
