import { createMemo, For, JSX, Show } from "solid-js";
import { createFunctionMemo } from "../util/createFunctionMemo";
import { hasActiveFlows, isValid } from "../util/validation-flows-messages";
import { UserInputVM } from "./input-models/UserInput.vm";

type SelectMultipleProps<TModel, TItem> =
    {
        selectAttributes?: JSX.HTMLAttributes<HTMLSelectElement>,
        messagesContainerAttributes?: JSX.HTMLAttributes<HTMLDivElement>,

        availableItems: TItem[],
        getItemId?: (item: TItem) => string,
        getItemDescription?: (item: TItem) => string,
        getModelId?: (item: TModel) => string,
        vm: UserInputVM<TModel[], TItem[]>,
        disabled?: boolean,
        onChangeAdditional?: (newVal: TItem[]) => void, 
        onBlurAdditional?: () => void,
    };

export function SelectMultiple<TModel, TItem>(
    props: SelectMultipleProps<TModel, TItem>) {

    const getItemId = createFunctionMemo(() =>
        props.getItemId ?? ((x) => x?.toString() ?? "")
    );

    const getItemDescription = createFunctionMemo(() =>
        props.getItemDescription ?? ((x) => x?.toString() ?? "")
    );

    function getSelectItemFromId(id: string) {

        const selectedItem = props.availableItems.find(
            (i) => id === getItemId(i)
        );

        if (selectedItem === undefined) {
            throw new Error();
        }

        return selectedItem;
    }

    const selectedIds = createMemo(() => {
        const uncommittedValue =  props.vm.state.uncommittedValue;

        if (uncommittedValue !== undefined) {
            return uncommittedValue.value.map(x => getItemId(x));
        }

        const committedValue =  props.vm.state.committedValue;

        return committedValue.map(x => 
            props.getModelId?.(x) ?? x?.toString() ?? "" );
    });

    return <>
        <select
            {...props.selectAttributes}
            classList={{
                ...props.selectAttributes?.classList,
                invalid: ! isValid(props.vm.state),
                touched:  props.vm.state.isTouched,
                pristine:  props.vm.state.committedValue === props.vm.state.pristineValue
            }}
            disabled={ props.disabled || hasActiveFlows(props.vm.state)}
            multiple={true}
            onChange={(e) => {
                const selectedItems =
                    [...e.currentTarget.selectedOptions].map(x =>  getSelectItemFromId(x.value));
                props.vm.setCurrentUncommittedValue(selectedItems);
                props.onChangeAdditional?.(selectedItems);
                props.vm.tryCommitValue();
            }}
            onBlur={(e) => {
                props.onBlurAdditional?.();
            }}
        >
            <For each={props.availableItems}>{
                (item, i) => {
                    const id = getItemId(item);
                    const description = getItemDescription(item);
                    return <option 
                            value={id}
                            selected={selectedIds().includes(id)}
                        >
                        {description}
                    </option>
                }}
            </For>
        </select>
        <Show
            when={props.vm.state.messages.length > 0}
            keyed={true}
        >
            <div {...props.messagesContainerAttributes}>
                <For each={props.vm.state.messages}>{(message, i) =>
                    <div>{message.type}: {message.message}</div>
                }
                </For>
            </div>
        </Show>
    </>;
}