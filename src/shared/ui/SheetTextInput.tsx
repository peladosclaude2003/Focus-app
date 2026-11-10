import { BottomSheetTextInput, useBottomSheetInternal } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

/**
 * TextInput que funciona bien con el teclado tanto dentro como fuera de un BottomSheet.
 *
 * Dentro de un sheet de @gorhom/bottom-sheet usa `BottomSheetTextInput`, que es lo que
 * permite al sheet desplazarse sobre el teclado (`keyboardBehavior`). Con un `TextInput`
 * normal el sheet no se entera de que el teclado está abierto y este tapa el campo.
 * Fuera de un sheet cae al `TextInput` estándar.
 */
export const SheetTextInput = forwardRef<TextInput, TextInputProps>(
  function SheetTextInput(props, ref) {
    const sheetContext = useBottomSheetInternal(true);
    if (sheetContext) {
      return <BottomSheetTextInput ref={ref as never} {...props} />;
    }
    return <TextInput ref={ref} {...props} />;
  },
);
