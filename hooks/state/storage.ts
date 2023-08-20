import { TCartState, TStoreState } from "@/types/storeState";
import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

export const useStoreState = create<TStoreState>()(
	devtools(
		persist(
			(set) => ({
				storeInfo: {},
				user: {},
			}),
			{
				name: "__bimals_closet_store_data__",
			}
		)
	)
);

export const useCartState = create<TCartState>()(
	devtools(
		persist(
			subscribeWithSelector((set, get) => ({
				cart: [],
				cartCount: 0,
				addToCart: (payload: Record<string, any>) => {
					const cartClone = [...get().cart];
					const isInCartIdx = cartClone.findIndex(
						(item) => item.id === payload.id
					);

					if (isInCartIdx === -1) {
						payload.quantity = 1;
						const cartItems = [...cartClone, payload];
						return set({ cart: cartItems, cartCount: cartItems.length });
					}

					cartClone[isInCartIdx].quantity += 1;
					return set({ cart: cartClone, cartCount: cartClone.length });
				},
				quantityCount: (id: string, type: string) => {
					const cartClone = [...get().cart];
					const item = cartClone.find((item) => item.id === id);

					if (item) {
						if (type === "increament") {
							item.quantity += 1;
						} else if (type === "decreament" && item.quantity > 1) {
							item.quantity -= 1;
						}

						return set({ cart: cartClone });
					}
				},
			})),
			{
				name: "__bimals_closet_cart__",
			}
		)
	)
);
