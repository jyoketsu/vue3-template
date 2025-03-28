<template>
  <div
    class="size-full flex flex-col justify-center items-center bg-gradient-to-tr from-emerald-900 to-emerald-100 dark:from-emerald-900 dark:to-zinc-900">

    <div class="flex flex-col justify-center items-center px-7 py-10 bg-white dark:bg-gray-800 rounded-md">
      <div class="font-bold text-2xl mb-10 flex items-center">
        <i class="bg-[url(/logo.svg)] bg-contain bg-no-repeat bg-center size-8 mr-2" />
        <p>Vue Template</p>
      </div>
      <el-form class="w-72 lg:w-80" ref="formRef" :model="loginForm" label-position="left" autocomplete="on"
        :rules="rules" @keyup.enter="onSubmit(formRef)">

        <el-form-item prop="username">
          <el-input v-model="loginForm.username" :placeholder="$t('auth.usernamePlaceholder')">
            <template #prefix>
              <UserIcon class="size-5" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" :placeholder="$t('auth.passwordPlaceholder')">
            <template #prefix>
              <LockKeyholeIcon class="size-5" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="captcha" class="w-full flex">
          <el-input v-model="loginForm.captcha" style="width: 130px" :placeholder="$t('auth.captcha')">
            <template #prefix>
              <ShieldHalf class="size-5" />
            </template>
          </el-input>
          <div class="flex-1 h-8 bg-contain bg-no-repeat bg-center cursor-pointer"
            :style="{ backgroundImage: `url(${captchaImage})` }" @click="getCode" />
        </el-form-item>

        <el-form-item class="mt-8">
          <el-button type="primary" style="width: 100%" @click="onSubmit(formRef)">
            {{ $t("auth.login") }}
          </el-button>
        </el-form-item>

        <div class="flex justify-center">
          <span class="text-sm text-gray-500">{{ $t("auth.noAccount") }}</span>
          <el-button link type="primary" @click="handle2Register">
            {{ $t("auth.registerNow") }}
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCaptcha } from "@/api/auth";
import { notification } from "@/Hooks/Element-plus";
import { useAuthStore } from "@/stores/auth";
import { FormInstance } from "element-plus";
import { LockKeyholeIcon, UserIcon, ShieldHalf } from "lucide-vue-next";
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const store = useAuthStore();
const { login } = store;

const formRef = ref<FormInstance>();
const loginForm = reactive({
  username: "",
  password: "",
  captcha: ''
});
const captchaImage = ref<string>('');

let rules = reactive({
  username: [
    { required: true, message: t("auth.usernamePlaceholder"), trigger: "change" },
  ],
  password: [
    { required: true, message: t("auth.passwordPlaceholder"), trigger: "change" },
    {
      min: 8,
      max: 100,
      message: t("auth.passwordValidater"),
      trigger: "change",
    },
  ],
  captcha: [
    { required: true, message: t("auth.captchaPlaceholder"), trigger: "change" },
  ],
});

onMounted(async () => {
  await getCode();
})

const getCode = async () => {
  captchaImage.value = await (getCaptcha()) || '';
}

const onSubmit = async (formEl?: FormInstance) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await login(loginForm);
      notification(t("auth.loginSuccess"), t("auth.welcome"), "success")
      router.push({ path: (route.query.url as any) || '/' });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const handle2Register = () => {
  router.push({ path: "/register" })
}
</script>
