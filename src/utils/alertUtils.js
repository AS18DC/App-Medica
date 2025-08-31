import { Alert, Platform } from 'react-native';

/**
 * Función de alerta compatible con web y móvil
 * @param {string} title - Título del alert
 * @param {string} message - Mensaje del alert
 * @param {Function} onPress - Función a ejecutar cuando se presiona OK
 */
export const showAlert = (title, message, onPress) => {
  if (Platform.OS === 'web') {
    // En web, usar confirm nativo del navegador
    if (window.confirm(`${title}\n\n${message}`)) {
      onPress && onPress();
    }
  } else {
    // En móvil, usar Alert de React Native
    Alert.alert(title, message, [
      {
        text: "OK",
        onPress: onPress
      }
    ]);
  }
};

/**
 * Función de alerta con múltiples botones (solo móvil)
 * @param {string} title - Título del alert
 * @param {string} message - Mensaje del alert
 * @param {Array} buttons - Array de botones [{text, onPress, style?}]
 */
export const showAlertWithButtons = (title, message, buttons) => {
  if (Platform.OS === 'web') {
    // En web, usar confirm simple
    if (window.confirm(`${title}\n\n${message}`)) {
      const okButton = buttons.find(btn => btn.text === 'OK' || btn.text === 'Aceptar');
      okButton?.onPress && okButton.onPress();
    } else {
      const cancelButton = buttons.find(btn => btn.text === 'Cancelar' || btn.text === 'Cancel');
      cancelButton?.onPress && cancelButton.onPress();
    }
  } else {
    // En móvil, usar Alert con múltiples botones
    Alert.alert(title, message, buttons);
  }
};

/**
 * Función de alerta de confirmación
 * @param {string} title - Título del alert
 * @param {string} message - Mensaje del alert
 * @param {Function} onConfirm - Función a ejecutar si se confirma
 * @param {Function} onCancel - Función a ejecutar si se cancela
 */
export const showConfirmAlert = (title, message, onConfirm, onCancel) => {
  if (Platform.OS === 'web') {
    // En web, usar confirm nativo
    if (window.confirm(`${title}\n\n${message}`)) {
      onConfirm && onConfirm();
    } else {
      onCancel && onCancel();
    }
  } else {
    // En móvil, usar Alert con dos botones
    Alert.alert(title, message, [
      {
        text: "Cancelar",
        style: "cancel",
        onPress: onCancel
      },
      {
        text: "Confirmar",
        onPress: onConfirm
      }
    ]);
  }
};
