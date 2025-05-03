<script>
    import { DotLottieSvelte } from "@lottiefiles/dotlottie-svelte";
    import { onDestroy } from "svelte";
    let dotLottie = null;
    let loopCount = 0;
    let isHovered = false;
    const maxLoops = 3;

    function onLoaded() {
        // Only autoplay if initially hovered
        if (isHovered) {
            dotLottie.play();
        }
    }

    function onPlay() {
    }

    function onPause() {
    }

    function onLoop() {
        loopCount++;
        // After third loop, disable looping if not hovered
        if (loopCount >= maxLoops && !isHovered) {
            dotLottie.setLoop(false);
        }
    }

    function onComplete() {
    }

    function handleMouseEnter() {
        isHovered = true;
        if (dotLottie) {
            dotLottie.play();
            dotLottie.setLoop(true);
        }
    }

    function handleMouseLeave() {
        isHovered = false;
        if (dotLottie && loopCount >= maxLoops) {
            dotLottie.setLoop(false);
        }
    }

    function setupListeners(dotLottieInstance) {
        dotLottieInstance.addEventListener("load", onLoaded);
        dotLottieInstance.addEventListener("play", onPlay);
        dotLottieInstance.addEventListener("pause", onPause);
        dotLottieInstance.addEventListener("loop", onLoop);
        dotLottieInstance.addEventListener("complete", onComplete);
    }

    function removeListeners(dotLottieInstance) {
        dotLottieInstance.removeEventListener("load", onLoaded);
        dotLottieInstance.removeEventListener("play", onPlay);
        dotLottieInstance.removeEventListener("pause", onPause);
        dotLottieInstance.removeEventListener("loop", onLoop);
        dotLottieInstance.removeEventListener("complete", onComplete);
    }

    onDestroy(() => {
        if (dotLottie) {
            removeListeners(dotLottie);
        }
    });
</script>

<div class="h-auto" 
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}>
    <DotLottieSvelte
        src="https://lottie.host/b9c72ba9-5de4-4997-ae45-1d1af1f917e9/kSHGjiweG6.lottie"
        loop={true}
        autoplay={false}
        dotLottieRefCallback={(ref) => {
            dotLottie = ref;
            setupListeners(dotLottie);
        }}
    />
</div>