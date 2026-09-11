import { boolean, z } from 'zod';
import { isValidBusinessNo, isValidPhone, isValidLoanAmount } from '@repo/ui/utils';

export const REPAY_TYPES = ["BULLET", "EQUAL_PRINCIPAL", "EQUAL_TOTAL"] as const;
export type RepayType = (typeof REPAY_TYPES)[number];

const BENEFITS = ["INTEREST_CUT", "LATE_FEE_WAIVER", "FREE_INSURANCE"] as const;



export const corporateSignupSchema = z.object({
  companyName: z.string().min(1, '상호명을 입력해주세요.'),
  businessNo: z
    .string()
    .min(1, '사업자등록번호를 입력해주세요.')
    .refine(isValidBusinessNo, '유효하지 않은 사업자등록번호입니다.'),
  phone: z
    .string()
    .refine(isValidPhone, '올바른 휴대폰 번호 형식이 아닙니다.'),
  loanAmount: z
    .number()
    .min(0, "대출 금액은 0보다 커야 합니다."),
  collateral: z
    .number()
    .min(0, "담보 가치는 0보다 커야 합니다."),
  repayType: z
    .enum(REPAY_TYPES)
    .default("BULLET"), 
  isEarlyRepayExempt: z
    .boolean()
    .default(false),
  isTermsAgreed: z
    .boolean()
    .refine((val) => val === true , {
    message: "필수 약관에 동의하셔야 합니다.",
  }),
  // 선택된 값들이 배열로 들어옴 (예: ["INTEREST_CUT", "FREE_INSURANCE"])
  preferredBenefits: z
    .array(z.enum(BENEFITS))
    .optional() // 옵션인지 확인하기
    .default([]), // 기본값은 빈 배열
    // .nonempty("최소 하나 이상의 혜택을 선택해주세요.") // 필수 선택인 경우 추가
  // 보증인 번호 (선택 사항이지만, 입력했다면 특정 규칙을 따라야 함)
  guarantorCode: z
    .string()
    .optional()
    .refine(
      (val) => {
        // 1. 값이 없으면(undefined) 검증을 통과시킵니다.
        if (val === undefined) return true; 
        
        // 2. 값이 있을 때만 실제 검증 로직을 수행합니다.
        return val.startsWith("SEC_"); 
      },
      { message: "보증인 코드는 'SEC_'로 시작해야 합니다." }
    ),
}).refine(
    // 1. 첫 번째 인자: 객체 전체(data)를 받아 기존 함수에 각각 대입합니다.
    (data) => isValidLoanAmount(data.loanAmount, data.collateral), 
    // 2. 두 번째 인자: 에러 메시지와 에러가 표시될 필드 위치를 지정합니다.
    {
      message: "담보 가치가 대출 금액의 140%를 초과해야 합니다.",
      path: ["loanAmount"], // 에러를 loanAmount 필드에 귀속시킵니다.
    }
  );;

export type CorporateSignupForm = z.infer<typeof corporateSignupSchema>;