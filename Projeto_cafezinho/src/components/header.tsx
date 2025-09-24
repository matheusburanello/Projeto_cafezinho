import { Image, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";

type HeaderProps = { // Define tipo das props do componente Header
  title: string; // Título a ser exibido no cabeçalho
  cartQuantityItem?: number; // Quantidade de itens no carrinho (opcional)
};

export function Header({ title, cartQuantityItem }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("@/assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>{title || 'Título'}</Text>
      </View>

      {cartQuantityItem! > 0 && (
        <Link href={"/cart"} asChild>
          <TouchableOpacity style={styles.cartButton}>
            <View style={styles.cartInner}> {/* Um único filho evita nós de texto soltos */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {cartQuantityItem || 0}
                </Text>
              </View>
              <Feather name="shopping-bag" color="#ffffff" size={24} />
            </View>
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingBottom: 20,
    marginHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    height: 24,
    width: 128,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
  },
  cartButton: {
    position: 'relative',
  },
  cartInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#bef264',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    zIndex: 10,
    right: -14,
  },
  badgeText: {
    color: '#1e293b',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
