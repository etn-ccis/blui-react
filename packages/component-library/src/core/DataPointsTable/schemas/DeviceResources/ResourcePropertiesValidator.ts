import { z } from 'zod';

type ValueTypeConstraint = string | readonly string[];
type ReadWriteConstraint = 'R' | 'W' | 'RW';

export type TypeConstraintsMap = Record<string, { valueType: ValueTypeConstraint; readWrite: ReadWriteConstraint }>;

export const createResourcePropertiesValidator =
    (typeConstraints: TypeConstraintsMap) =>
    (
        data: { attributes: { type: string }; properties: { valueType: string; readWrite: string } },
        ctx: z.RefinementCtx
    ): void => {
        const attributeType = data.attributes.type;
        const { valueType, readWrite } = data.properties;

        const constraint = typeConstraints[attributeType];
        if (!constraint) return;

        // Validate valueType
        const expectedValueTypes = Array.isArray(constraint.valueType) ? constraint.valueType : [constraint.valueType];
        if (!expectedValueTypes.includes(valueType)) {
            ctx.addIssue({
                code: 'custom',
                path: ['properties', 'valueType'],
                message: `For ${attributeType}, valueType must be ${expectedValueTypes.length > 1 ? expectedValueTypes.join(' or ') : expectedValueTypes[0]}.`,
            });
        }

        // Validate readWrite
        if (readWrite !== constraint.readWrite) {
            ctx.addIssue({
                code: 'custom',
                path: ['properties', 'readWrite'],
                message: `For ${attributeType}, readWrite must be ${constraint.readWrite}.`,
            });
        }
    };
