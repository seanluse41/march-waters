export const actions = {
    default: async ({ request }) => {
      try {
        // Get form data
        const formData = await request.formData();
        
        // Extract form values
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const phone = formData.get('phone') || '';
        const message = formData.get('message') || '';
        const otherReason = formData.get('otherReason') || '';
        
        // Extract reasons for contact
        const reasons = {
          childcare: formData.has('childcare'),
          bodyChoice: formData.has('bodyChoice'),
          midwife: formData.has('midwife'),
          event: formData.has('event'),
          other: formData.has('other')
        };
        
        // Create data object to log
        const contactData = {
          name,
          email,
          phone,
          reasons,
          otherReason,
          message
        };
        
        // Log data to console (server-side)
        console.log('Form submitted:', contactData);
        
        // Return success message to the page
        return {
          success: true,
          data: contactData
        };
      } catch (error) {
        console.error('Error processing form:', error);
        return {
          success: false,
          error: 'Failed to process form submission'
        };
      }
    }
  };