import type { ComponentPropsWithoutRef, ElementType } from "react";

type RevealProps = ComponentPropsWithoutRef<"div"> & { delay?: number };

export function Reveal({ delay: _delay, ...props }: RevealProps) {
  void _delay;
  return <div {...props} />;
}

export function RevealGroup(props: ComponentPropsWithoutRef<"div">) {
  return <div {...props} />;
}

type RevealItemProps<T extends ElementType> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function RevealItem<T extends ElementType = "div">({
  as,
  ...props
}: RevealItemProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return <Component {...props} />;
}

export const EASE_OUT_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];
