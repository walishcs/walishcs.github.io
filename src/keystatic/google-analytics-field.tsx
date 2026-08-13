import { fields } from '@keystatic/core';
import { TextLink } from '@keystar/ui/link';
import { VStack } from '@keystar/ui/layout';
import {
  GOOGLE_ANALYTICS_MEASUREMENT_ID_PATTERN,
  GOOGLE_ANALYTICS_TAG_ID_HELP_URL,
} from '@/lib/google-analytics';

export function googleAnalyticsMeasurementIdField() {
  const field = fields.text({
    label: 'Google Analytics measurement ID',
    description:
      'Optional. Enter a GA4 ID beginning with G-. Analytics loads only on the production website.',
    validation: {
      pattern: {
        regex: GOOGLE_ANALYTICS_MEASUREMENT_ID_PATTERN,
        message: 'Enter a GA4 measurement ID such as G-XXXXXXXXXX.',
      },
    },
  });
  const FieldInput = field.Input;

  return {
    ...field,
    Input(props: Parameters<typeof FieldInput>[0]) {
      return (
        <VStack gap="small">
          <FieldInput {...props} />
          <TextLink
            href={GOOGLE_ANALYTICS_TAG_ID_HELP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            How to find your Google tag ID
          </TextLink>
        </VStack>
      );
    },
  };
}
