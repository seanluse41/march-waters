<script>
    import { onMount } from 'svelte';
    import Vara from 'vara';
    
    export let containerId = "vara-container";
    let containerElement;
    
    onMount(() => {
      const varaInstance = new Vara(
        `#${containerId}`, 
        '/PacificoSLO.json',
        [{
          text: "March Waters",
          fontSize: 32,
          strokeWidth: 1,
          color: "#1a1a1a",
          duration: 2500,
          textAlign: "center"
        }]
      );
      
      if (containerElement) {
        containerElement.varaInstance = varaInstance;
      }
      return () => {
        if (varaInstance && typeof varaInstance.destroy === 'function') {
          varaInstance.destroy();
        }
      };
    });
  </script>
  
  <div id={containerId} bind:this={containerElement}></div>
  
  <style>
    div {
      width: 100%;
      min-height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>