<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-btn color="primary" class="add-btn" icon="add" label="Добавить учетную запись" @click="addAccount" />
      <!-- Дефолт кнопка quasar'a можно накинуть стилей ей, в css. Но вроде и так неплохо выглядит -->

      <div v-if="accounts.length > 0" class="accounts-container">
        <!-- Открыаем наш лист, если записей больше, чем одна и уже по курсору прокидываем записи, которые получили из стора -->
        <q-card v-for="(account, index) in accounts" :key="index" class="account-card">
          <q-card-section class="row items-center">
            <!-- Тут обрабатываем нашу валидацию в инпутах. Обрабатываем с помощью хука блур -->
            <div class="col field">
              <q-input
                v-model="labelInputs[index]"
                label="Метка"
                hint="Введите несколько меток через ;"
                maxlength="50"
                @blur="handleLabelBlur(index)"
                dense
              />
            </div>
            <div class="col field">
              <q-select
                v-model="account.type"
                :options="['LDAP', 'Local']"
                @update:model-value="updateType(index)"
                dense
              />
            </div>
            <div class="col field">
              <!-- Аналогично, здесь мы так же используем блур и делаем валидации -->
              <q-input
                v-model="account.login"
                label="Логин"
                maxlength="100"
                @blur="validateAccount(index)"
                :error="!account.validLogin && account.touched"
                error-message="Поле обязательнео к вводу"
                dense
              />
            </div>
            <!-- Если пользователь ldap то не пишем пароль -->
            <div v-if="account.type === 'Local'" class="col field">
              <q-input
                v-model="account.password"
                label="Пароль"
                type="password"
                maxlength="100"
                @blur="validateAccount(index)"
                :error="!account.validPassword && account.touched"
                error-message="Поле обязательнео к вводу"
                dense
              />
            </div>
            <q-btn flat round dense color="negative" icon="delete" class="delete-btn" @click="removeAccount(index)" />
          </q-card-section>
        </q-card>
      </div>

      <h3 v-else class="text-center text-grey-6 no-accounts">Нет добавленных учетных записей</h3>
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
    const labelInputs = ref<string[]>([]); // времянка

    // Наш маунтед, получаем пока из локал стора, если успею переведу на pinia
    // TODO: Pinia
    onMounted(() => {
      const storedAccounts = localStorage.getItem('accounts');
      if (storedAccounts) {
        accounts.value = JSON.parse(storedAccounts);

        // чекаем, является ли acc.label массивом, если нет, то преобразуем
        labelInputs.value = accounts.value.map(acc =>
          Array.isArray(acc.label)
            ? acc.label.map(l => l.text).join('; ')
            : acc.label ?? '' // если нет, то просто используем значение или пустую строку
        );
      }
    });

    const addAccount = () => {
      accounts.value.push({
        // Добавляем новый объект в массив accounts
        label: [],
        type: 'LDAP',
        login: '',
        password: null,
        validLogin: false,
        validPassword: false,
        touched: false, // Правили запись или нет? Без него во всех строках упремся в валидацию
      });
      labelInputs.value.push('');
    };

    const removeAccount = (index: number) => {
      // Удаляем элемент из массива accounts по индексу. Вообще за такое нужно бить по рукам разработчику
      // т.к. если приложение разрастется, то в дальнейшем могут быть проблемы, при удалении из массива по индексу
      accounts.value.splice(index, 1);
      labelInputs.value.splice(index, 1);
      saveAccounts(); // Сейв на всякий случай
    };

    // Пробрасываем пароль null если ldap пользователь
    const updateType = (index: number) => {
      if (!accounts.value[index]) {
        return;
      }

      if (accounts.value[index].type === 'LDAP') {
        accounts.value[index].password = null;
      }

      validateAccount(index);
      saveAccounts();
    };

    const validateAccount = (index: number) => {
      // Функция для валидации аккаунта
      const account = accounts.value[index];

      if (!account) {
        return; // защищаем  от undf..
      }

      account.touched = true;
      account.validLogin = !!account.login;
      account.validPassword = account.type === 'LDAP' || !!account.password;

      saveAccounts();
    };

    // Блур для наших меток, после ввода преобразуем их в массив разделенный по ;
    const handleLabelBlur = (index: number) => {
      const rawLabel = labelInputs.value[index] ? labelInputs.value[index].trim() : '';
      const labelsArray = rawLabel.length > 0 ? rawLabel.split(';').map(label => label.trim()) : [];

      if (accounts.value[index]) {
        accounts.value[index].label = labelsArray
          .filter(label => label.length > 0)
          .map(label => ({ text: label }));
        accounts.value[index].touched = true;
      }

      saveAccounts();
    };

    const saveAccounts = () => {
      localStorage.setItem('accounts', JSON.stringify(accounts.value));
      console.log(localStorage.getItem('accounts'));
      // Сохраняем аккаунты в localStorage
    };

    return {
      accounts,
      labelInputs,
      addAccount,
      removeAccount,
      updateType,
      validateAccount,
      handleLabelBlur
    };
  }
};
</script>

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 15px;
  font-size: 16px;
}

.accounts-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.account-card {
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.field {
  padding-right: 8px;
  min-width: 150px;
}

.delete-btn {
  margin-left: auto;
}

.no-accounts {
  margin-top: 20px;
  font-size: 18px;
  font-weight: 400;
}
.q-select {
  margin-bottom: 20px;
}
</style>

