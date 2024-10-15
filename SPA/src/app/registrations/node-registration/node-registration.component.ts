import { IfStmt } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { isBreakOrContinueStatement } from 'typescript';
import { NodeServiceService } from '../../core/services/node-service.service';
import { NodeInterface } from '../../shared/models/node/NodeInterface';

@Component({
	selector: 'app-node',
	templateUrl: './node-registration.component.html',
	styleUrls: [ './node-registration.component.css' ]
})
export class NodeRegistrationComponent implements OnInit {
	errorMessage: string;
	successMessage: string;
	arrakyofKeys: string[] = [];
	public node = {
		// object of the same type as Node with default values
		name: undefined,
		shortName: undefined,
		latitude: undefined,
		longitude: undefined,
		isDepot: '',
		isReliefPoint: '',
		crewTravelTimes: undefined,
		crewTravelTimeReferenceNode: undefined
	};
	public nodes: any[];
	public nodesNames: string[];
	private routeSub: Subscription;

	constructor(private nodeServiceService: NodeServiceService) {}

	ngOnInit(): void {

	}

	async onSubmit(form) {
		if (this.nodes) {
			for (let nodeele of this.nodes) {
				if (this.node.crewTravelTimeReferenceNode == nodeele.name) {
					this.node.crewTravelTimeReferenceNode = nodeele.shortName; // client select by name and here i convert it to shortname as i expect it in the deeper layers
					break;
				}
			}
		}

		try {
			this.nodeServiceService.registerNode(this.node as NodeInterface).subscribe(
				(data) => {
					this.errorMessage = undefined;
					this.successMessage = 'Node Created Sucessfully ';

					form.resetForm();
					return data;
				},
				(error) => {
					this.handleErrors(error.error);
					return error;
				}
			);
		} catch (err) {
			this.handleErrors(err.message);
		}
	}

	getNodesNames() {
		if (this.node.crewTravelTimeReferenceNode) {
			this.nodeServiceService.getNodesByNames(this.node.crewTravelTimeReferenceNode).subscribe(
				(data) => {
					this.nodes = data;

					this.nodesNames = data.map((element) => {
						return element.name;
					});

				},
				(error) => {
					this.handleErrors(error.error);
				}
			);
			return this.nodesNames;
		}
	}

	handleErrors(error) {
		this.successMessage = undefined;

		if (error.substring(0, 16) == 'E11000 duplicate') {
			this.errorMessage = 'Error: That node already exists in the system';
		} else if (error.includes('proxy')) {
			this.errorMessage = 'Error: could not connect to backend server';
		} else {
			this.errorMessage = error;
		}
	}
}
