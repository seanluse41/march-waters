export const actions = {
    default: async ({ request }) => {
      try {
        const formData = await request.formData();
        
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const phone = formData.get('phone') || '';
        const message = formData.get('message') || '';
        const otherReason = formData.get('otherReason') || '';
        const dinner = formData.has('dinner');
        
        if (dinner) {
          console.log('Bot detected - dinner checkbox checked');
          return {
            success: true,
            data: null
          };
        }
                
        const reasons = {
          childcare: formData.has('childcare'),
          bodyChoice: formData.has('bodyChoice'),
          midwife: formData.has('midwife'),
          event: formData.has('event'),
          other: formData.has('other')
        };
        
        const contactData = {
          name,
          email,
          phone,
          reasons,
          otherReason,
          message
        };
        
        console.log('Valid form submitted:', contactData);
        
        // Send contact email
        const { sendContactEmail } = await import('$lib/requests/sendContactEmail.js');
        const emailResult = await sendContactEmail(contactData);
        if (!emailResult.success) {
          console.warn('Contact email failed to send:', emailResult.error);
          // Don't fail the form submission, just log the issue
        }
        
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