import { expandMagnitudeShortcuts } from "../util/numeric";
import { AtomicValidator, atomicValidator, getInputState, InputState } from "./UserInput.pure";
import { getUserInputVM } from "./UserInput.vm";


// Normally there would be versions for both Number and Number | undefined.
// For demo purposes I keep it short.

const numberAtomicValidatorFns = {

    integer:() => atomicValidator(
        "numberAtomicValidator.integer",
        (val: number | undefined) => typeof val !== 'number' || Number.isInteger(val),
        (val: number | undefined) =>`Value ${val} must be an integer`),
    
    positive:() => atomicValidator(
        "numberAtomicValidator.positive",
        (val: number | undefined) => typeof val !== 'number' || val < 0,
        (val: number | undefined) => `Value ${val} must be positive`),
    
    lessThan:(bound: number) => atomicValidator(
        "numberAtomicValidator.lessThan",
        (val: number | undefined) => typeof val !== 'number' || val >= bound,
        (val: number | undefined) => `Value ${val} must be less than ${bound}`),

    between:(loverBound: number, upperBound: number) => atomicValidator(
        "numberAtomicValidator.between",
        (val: number | undefined) => typeof val !== 'number' || loverBound > val || val > upperBound,
        (val: number | undefined) => `Value ${val} must be between ${loverBound} and ${upperBound}`),
    
    // many more...
} as const;


export const getNumericInputVM = (
    getState: () => InputState<number | undefined, string>,
    updateState: (update: (stateDraft: InputState<number | undefined, string>) => void) => void,
    validators: AtomicValidator<number | undefined>[] = []
) => getUserInputVM(
    getState,
    updateState,
    (val) => {
        const expanded = expandMagnitudeShortcuts(val);
        const num = Number(expanded);
        if(Number.isNaN(num) 
            || !Number.isFinite(num)) {
                return {
                    status: "error",
                    message: 'Please enter a valid number'
                }
        }
        return {
            status: "parsed",
            parsed: num
        }
    },
    (val) => (val ?? "").toString(),
    validators);

export type NumericInputVM = ReturnType<typeof getNumericInputVM>;
    