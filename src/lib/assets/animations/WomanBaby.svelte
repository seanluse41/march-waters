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
        console.log("Animation started");
    }

    function onPause() {
        console.log("Animation paused");
    }

    function onLoop() {
        loopCount++;
        // After third loop, disable looping if not hovered
        if (loopCount >= maxLoops && !isHovered) {
            dotLottie.setLoop(false);
        }
    }

    function onComplete() {
        console.log("Animation completed");
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
        src="https://lottie.host/c2d533bb-5cbc-4429-86b1-6ad65c92308d/b5XL3vWKfF.lottie"
        loop={true}
        autoplay={false}
        dotLottieRefCallback={(ref) => {
            dotLottie = ref;
            setupListeners(dotLottie);
        }}
    />
</div>