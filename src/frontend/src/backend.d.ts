import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ReportRequestInput {
    businessObjective: string;
    justification: string;
    urgencyLevel: UrgencyLevel;
    dataSource: string;
    requiredKPIs: string;
    requesterName: string;
    department: string;
    requiredFilters: string;
}
export type Time = bigint;
export interface ReviewInput {
    status: Status;
    reviewerComments?: string;
    assignedReviewer?: Principal;
}
export interface ReportRequest {
    businessObjective: string;
    status: Status;
    justification: string;
    reviewerComments?: string;
    urgencyLevel: UrgencyLevel;
    dataSource: string;
    assignedReviewer?: Principal;
    requiredKPIs: string;
    submissionDate: Time;
    requesterName: string;
    department: string;
    requiredFilters: string;
}
export enum Status {
    pending = "pending",
    completed = "completed",
    inDevelopment = "inDevelopment",
    approved = "approved",
    rejected = "rejected"
}
export enum UrgencyLevel {
    low = "low",
    high = "high",
    medium = "medium"
}
export interface backendInterface {
    getRequests(): Promise<Array<ReportRequest>>;
    reviewRequest(user: Principal, input: ReviewInput): Promise<void>;
    submitRequest(input: ReportRequestInput): Promise<void>;
}
