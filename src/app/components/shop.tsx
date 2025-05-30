"use client";

import { CardMetadata } from "~/simulation/simulation";
import { DndContext } from "@dnd-kit/core";
import { DroppableCard } from "./droppable-card";
import { DraggableCard } from "./draggable-card";
import { useId } from "react";
import { Button } from "./button";
import { LoadingButton } from "./loading-button";
import { Tooltip } from "./tooltip";

interface ShopProps {
    cards: CardMetadata[];
    deck: (CardMetadata | null)[];
    bytes: number;
    health: number;
    takeCard(cardId: string, position: number): void;
    beginRound(): void;
}

export function Shop({
    cards,
    deck,
    bytes,
    health,
    takeCard,
    beginRound,
}: ShopProps) {
    const dndId = useId();
    return (
        <DndContext
            id={dndId}
            onDragEnd={(event) => {
                if (
                    event.over &&
                    event.over.id.toString().startsWith("shop:deck") &&
                    event.active.id.toString().startsWith("shop:item")
                ) {
                    const { position } = event.over.data.current!;
                    const data = event.active.data.current;
                    if (data && "cardId" in data) {
                        takeCard(data.cardId, position);
                    }
                }
            }}
        >
            <article className="flex flex-col justify-center items-center">
                <h1 className="relative mx-auto text-3xl text-white bg-neutral-600 inline-block py-1 px-16 top-7">
                    Shop
                </h1>
                <section className="flex flex-col sm:flex-row gap-4 bg-neutral-200 p-5 justify-between">
                    <figure className="mx-auto my-10 grid grid-cols-2 md:grid-cols-4 gap-1 flex-grow">
                        {cards.map((card, i) => (
                            <DraggableCard
                                key={i}
                                id={`shop:item:${i}`}
                                metadata={card}
                            />
                        ))}
                    </figure>
                    <div className="flex flex-col gap-2 bg-neutral-400 p-4 text-center">
                        <h2 className="text-3xl text-white bg-neutral-600 py-1">
                            Deck
                        </h2>

                        <figure className="grid xl:grid-cols-2 grid-cols-1 gap-2 w-fit mx-auto">
                            {deck.map((card, i) => (
                                <DroppableCard
                                    key={i}
                                    id={`shop:deck:${i}`}
                                    position={i}
                                    card={card ?? undefined}
                                />
                            ))}
                        </figure>

                        <section className="flex flex-col xl:flex-row gap-2 mt-4 text-white">
                            <p className="bg-neutral-500 flex-1 p-4">
                                {bytes} Bytes
                            </p>
                            <p className="bg-neutral-500 flex-1 p-4">
                                {health} Lives
                            </p>
                        </section>
                    </div>
                </section>
                <LoadingButton
                    className="mt-2 w-fit"
                    onClick={beginRound}
                    disabled={deck.some((card) => !card)}
                >
                    Begin Round
                </LoadingButton>
            </article>
        </DndContext>
    );
}
