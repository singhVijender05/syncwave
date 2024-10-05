import toast from 'react-hot-toast';

export const showToast = (message, type = 'success') => {
    const retroStyles = {
        success: {
            style: {
                border: '2px solid #00FF7F', // Neon green border
                background: '#DFFFDE',       // Light neon green background
                padding: '16px',
                color: '#006400',            // Dark green text
            },
            iconTheme: {
                primary: 'darkgreen',
                secondary: '#DFFFDE',
            }
        },
        error: {
            style: {
                border: '2px solid #FF4500', // Bright red-orange border
                background: '#FFE5E0',       // Light red background
                padding: '16px',
                color: '#8B0000',            // Dark red text
            },
            iconTheme: {
                primary: '#FF4500',
                secondary: '#FFE5E0',
            }
        },
        loading: {
            style: {
                border: '2px solid #FFD700', // Gold border
                background: '#FFF9E3',       // Light yellow background
                padding: '16px',
                color: '#DAA520',            // Goldenrod text
            },
            iconTheme: {
                primary: '#FFD700',
                secondary: '#FFF9E3',
            }
        },
        info: {
            style: {
                border: '2px solid #1E90FF', // Dodger blue border
                background: '#E0F7FF',       // Light blue background
                padding: '16px',
                color: '#104E8B',            // Dark blue text
            },
            iconTheme: {
                primary: '#1E90FF',
                secondary: '#E0F7FF',
            },
            icon: 'ℹ️',
        },
        default: {
            style: {
                border: '2px solid #A9A9A9', // Gray border
                background: '#F0F0F0',       // Light gray background
                padding: '16px',
                color: '#2F4F4F',            // Dark slate gray text
            },
            iconTheme: {
                primary: '#A9A9A9',
                secondary: '#F0F0F0',
            },
            icon: '👀',
        }
    };

    switch (type) {
        case 'success':
            toast.success(message, retroStyles.success);
            break;
        case 'error':
            toast.error(message, retroStyles.error);
            break;
        case 'loading':
            toast.loading(message, retroStyles.loading);
            break;
        case 'info':
            toast(message, retroStyles.info);
            break;
        case 'dismiss':
            toast.dismiss();
            break;
        default:
            toast(message, retroStyles.default);
            break;
    }
};
