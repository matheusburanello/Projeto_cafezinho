import { Text, Pressable, PressableProps, StyleSheet } from "react-native";

type CategoryProps = PressableProps & { // Define tipo que estende props do Pressable
  title: string; // Título da categoria
  isSelected?: boolean; // Se a categoria está selecionada (opcional)
};

export function CategoryButton({ title, isSelected, ...rest }: CategoryProps) {
  return (
    <Pressable
      style={[styles.button, isSelected && styles.selectedButton]}
      {...rest}
    >
      <Text style={styles.text}>{title || 'Categoria'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 6,
    height: 40,
  },
  selectedButton: {
    backgroundColor: '#f97316',
    borderWidth: 1,
    borderColor: '#bef264',
  },
  text: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '500',
  },
});
