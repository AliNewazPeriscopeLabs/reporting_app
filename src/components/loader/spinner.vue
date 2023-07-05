<template>
    <div class="lds-dual-ring-container">
        <div class="lds-dual-ring"></div>
    </div>    
</template>
<script>
export default {

}
</script>
<style>
    .lds-dual-ring-container {
        position: fixed;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.2);
        width: 100%;
        height: 100vh;
        z-index: 99999;
    }
    .lds-dual-ring {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);        
        display: inline-block;
        width: 80px;
        height: 80px;
    }
    .lds-dual-ring:after {
        content: " ";
        display: block;
        width: 64px;
        height: 64px;
        margin: 8px;
        border-radius: 50%;
        border: 6px solid #fff;
        border-color: black transparent black transparent;
        animation: lds-dual-ring 1.2s linear infinite;
    }
    @keyframes lds-dual-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    
</style>

