<script>
    import { _ } from "svelte-i18n";
    
    // Import icons from the list you provided
    import { 
      ImageOutline, // For Instagram
      NewspaperOutline, // For Note
      TwitterSolid, // Corrected to TwitterSolid as you mentioned
      MessagesOutline // For LINE
    } from 'flowbite-svelte-icons';
    
    // Social media data with i18n
    $: socials = [
      {
        name: 'instagram',
        icon: ImageOutline,
        url: 'https://www.instagram.com/marchwatersss/',
        handle: '@marchwatersss'
      },
      {
        name: 'note',
        icon: NewspaperOutline,
        url: 'https://note.com/kind_phlox908',
        handle: $_('top.socials.note.handle')
      },
      {
        name: 'twitter',
        icon: TwitterSolid,
        url: '#',
        handle: '@placeholder'
      },
      {
        name: 'line',
        icon: MessagesOutline,
        url: '#',
        handle: $_('top.socials.line.handle')
      }
    ];
  </script>
  
  <div class="mx-auto">
    <h2 class="text-xl font-bold mb-4">{$_('top.socials.heading')}</h2>
    <div class="flex flex-col space-y-3">
      {#each socials as social}
        <a href={social.url} class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200" target="_blank" rel="noopener noreferrer">
          <div class="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full mr-4">
            <svelte:component this={social.icon} class="w-5 h-5 text-gray-700" />
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-sm">{$_(`top.socials.${social.name}.title`)}</span>
            <span class="text-xs text-gray-500">{social.handle}</span>
          </div>
        </a>
      {/each}
    </div>
  </div>