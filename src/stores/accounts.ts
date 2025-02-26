import { defineStore } from 'pinia';
// Все равно без localstorage не обойтись, есть несколько решений, но они долгие + не нужные
// 1. Можем хранить в памяти pinia, но если обновим страницу - данные удаляться
// 2. Можем цепляться за сессию, но а зачем? если браузер закроем и откроем заново то данных не будет
// 3. Можно через куки, но сложно + долго реализовывать (мало времени)
// 4. Хранить на сервере данные.
export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: JSON.parse(localStorage.getItem('accounts') || '[]')
  }),

  actions: {
    addAccount() {
      this.accounts.push({ type: 'LDAP', login: '', password: null, label: '' });
      this.saveToLocalStorage();
    },

    removeAccount(index: number) {
      this.accounts.splice(index, 1);
      this.saveToLocalStorage();
    },

    updateLabel(index: number, label: string) {
      this.accounts[index].label = label
        .split(';')
        .map(l => l.trim())
        .filter(l => l !== '');

      this.saveToLocalStorage();
    },

    updateType() {
      this.saveToLocalStorage();
    },

    validateAccount(index: number) {
      const account = this.accounts[index];
      account.touched = true;
      account.validLogin = account.login.trim() !== '';
      account.validPassword = account.type === 'Local' ? account.password.trim() !== '' : true;
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem('accounts', JSON.stringify(this.accounts));
    }
  }
});
