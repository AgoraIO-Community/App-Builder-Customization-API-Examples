<template>
    <div class="agora-container">
      <app-builder />
    </div>
  </template>

  <!-- <template>
    <div class="agora-container">
      <h2>Meeting Info</h2>
      <p><strong>Meeting ID:</strong> {{ props.meeting }}</p>
      <p><strong>User Name:</strong> {{ props.userName }}</p>
      <p><strong>User Token:</strong> {{ props.userToken }}</p>
    </div>
  </template> -->
  
  <script setup>
  import { onMounted } from 'vue';
  import AgoraAppBuilder from '@appbuilder/web';

  //eslint-disable-next-line no-undef
  const props = defineProps({
    meetingId: String,
    userToken: String,
    userName: String
  });

  console.log('Props received in AppBuilderApp:', props);
  
  const initApp = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isBot = !!urlParams.get('bot');
  
    await AgoraAppBuilder.login(props.userToken);
  
    await AgoraAppBuilder.joinPrecall(
      props.meetingId,
      props.userName,
      isBot
    );
  
    // AgoraAppBuilder.customize({
    //   config: {
    //     defaultRootFallback: () => null,
    //   },
    // });
  };
  
  onMounted(() => {
    initApp();
  });
  </script>
  
  <style scoped>
  .agora-container {
    width: 100vw;
    height: 100vh;
    display: flex;
  }
  </style>
  