<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-btn color="primary" class = "q-btn" label="Добавить учетную запись" @click="addAccount" />
      <!-- Дефолт кнопка quasar'a можно накинуть стилей ей, в css. Но вроде и так неплохо выглядит -->

      <q-list bordered separator v-if="accounts.length > 0">
        <!-- Открыаем наш лист, если записей больше, чем одна и уже по курсору прокидываем записи, которые получили из стора -->
        <q-item v-for="(account, index) in accounts" :key="index" class="account">
          <q-item-section>
            <!-- Тут обрабатываем нашу валидацию в инпутах. Обрабатываем с помощью хука блур -->
            <q-input
              v-model="account.label"
              label="Метка"
              @blur="validateAccount(account)"
              :error="!account.valid && account.touched"
              :error-message="(!account.valid && account.touched) ? 'Поле обязательнео к вводу' : ''"
            />
          </q-item-section>
          <q-item-section>
            <!-- Аналогично, здесь мы так же используем блур и делаем валидации -->
            <q-select
              v-model="account.type"
              :options="['LDAP', 'Local']"
              label="Тип"
              @change="validateAccount(account)"
              :error="!account.valid && account.touched"
              :error-message="(!account.valid && account.touched) ? 'Поле обязательнео к вводу' : ''"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="account.login"
              label="Логин"
              @blur="validateAccount(account)"
              :error="!account.valid && account.touched"
              :error-message="(!account.valid && account.touched) ? 'Поле обязательнео к вводу' : ''"
            />
          </q-item-section>
          <q-item-section v-if="account.type === 'Local'">
            <!--  Данную секцию показываем, только тогда, когда у нас юзер не LDAP -->
            <q-input
              v-model="account.password"
              label="Пароль"
              type="password"
              @blur="validateAccount(account)"
              :error="!account.valid && account.touched"
              :error-message="(!account.valid && account.touched) ? 'Поле обязательнео к вводу' : ''"
            />
          </q-item-section>
          <q-item-section side>
            <q-btn color="negative" round icon="delete" @click="removeAccount(index)" />
          </q-item-section>
        </q-item>
      </q-list>
      <!-- Если записей нет, то нужно что-то показывать юзеру -->
      <h3 v-else class="text-center text-grey-6">Нет добавленных учетных записей</h3>
    </div>
  </q-page>
</template>

<script lang="ts">
// И так обычно я это не делаю. Но в качестве тестового задания распишу, что за что отвечает и как работает
import { ref, onMounted } from 'vue'; // Здесь подключаем реактивность и хук маунтед для загрузки данных
import type { Account } from "src/types/types"; // Здесь уже работаем с нашим типом данных. В прошлом комите мы это описали

export default {
  setup() {
    const accounts = ref<Account[]>([]);

    const addAccount = () => {
      accounts.value.push({
        // Добавляем новый объект в массив accounts
        label: '',
        type: 'LDAP',
        login: '',
        password: '',
        valid: false,
        touched: false, // Правили запись или нет? Без него во всех строках упремся в валидацию
      });
    };

    const removeAccount = (index: number) => {
      // Удаляем элемент из массива accounts по индексу. Вообще не очень хорошая практика делать такой индекс
      // т.к. если приложение разрастется, то в дальнейшем могут быть проблемы, при удалении
      console.log(index);
      accounts.value.splice(index, 1);
    };

    const validateAccount = (account: Account) => {
      // Функция для валидации аккаунта
      account.touched = true;
      // Как раз таки что я и говорил выше
      if (account.login && (account.type === 'LDAP' || (account.type === 'Local' && account.password))) {
        // чекаем валидность
        account.valid = true;
      } else {
        account.valid = false;
      }
      saveAccounts(); // Сохраняем аккаунты
    };

    const saveAccounts = () => {
      localStorage.setItem('accounts', JSON.stringify(accounts.value));
      // Сохраняем аккаунты в localStorage
    };

    onMounted(() => {
      // Хук жизненного цикла, вызывается когда компонент был "смонтирован"
      const storedAccounts = localStorage.getItem('accounts');
      // Получаем аккаунты из localStorage
      if (storedAccounts) {
        accounts.value = JSON.parse(storedAccounts);
        // Парсим строку в объект
      }
    });

    return {
      // Возвращаем переменные и функции, чтобы их можно было использовать в template
      accounts,
      addAccount,
      removeAccount,
      validateAccount,
    };
  },
};
</script>
<style lang="scss" scoped>
.q-btn {
  margin-bottom: 10px;
}
</style>
