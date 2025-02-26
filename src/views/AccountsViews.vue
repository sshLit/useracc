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
                @update:model-value="updateType()"
                dense
              />
            </div>
            <!-- Аналогично, здесь мы так же используем блур и делаем валидации -->
            <div class="col field">
              <q-input
                v-model="account.login"
                label="Логин"
                maxlength="100"
                @blur="validateAccount(index)"
                :error="!account.validLogin && account.touched"
                error-message="Поле обязательно к вводу"
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
                error-message="Поле обязательно к вводу"
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
import { computed, ref, watch } from 'vue'; // Здесь подключаем реактивность вотчер и компьютед свойствва. мантед больше не нужен
import { useAccountsStore } from 'src/stores/accounts'; // Наш стор
import type { Account } from 'src/types/types'; // Здесь уже работаем с нашим типом данных. В прошлом комите мы это описали

export default {
  setup() {
    const store = useAccountsStore();  // Получаем данные из нашего стора
    const accounts = computed(() => store.accounts); // А теперь их вставляем
    // Наши метки, через ;
    const labelInputs = ref<string[]>(accounts.value.map((acc: Account) =>
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      Array.isArray(acc.label) ? acc.label.join('; ') : acc.label ?? ''
    ));

    watch(accounts, (newAccounts: Account[]) => {
      labelInputs.value = newAccounts.map(acc =>
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        Array.isArray(acc.label) ? acc.label.join('; ') : acc.label ?? ''
      );
    }, { deep: true });


    // Сохраняем запись в стор
    const addAccount = () => {
      store.addAccount();
      labelInputs.value.push('');
    };
    // делит запись из стора
    const removeAccount = (index: number) => {
      store.removeAccount(index);
      labelInputs.value.splice(index, 1);
    };
    // если чет поменяли то апдейтим
    const updateType = () => {
      store.updateType();
    };

    // проверяем валидацию
    const validateAccount = (index: number) => {
      store.validateAccount(index);
    };
    // Наш блур
    const handleLabelBlur = (index: number) => {
      store.updateLabel(index, labelInputs.value[index] ?? '');
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
