import React, { Suspense, lazy } from 'react';
import '../Search.css';
import axios from 'axios';
import Loader from '../loader.gif';
import PageNavigation from './PageNavigation';

class Search extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			query: '',
			results: {},
			loading: false,
			message: '',
			totalResults: 0,
			totalPages: 0,
			currentPageNo: 0,
		};

		this.cancel = '';
	}


	/**
	 * Get the Total Pages count.
	 *
	 * @param total
	 * @param denominator Count of results per page
	 * @return {number}
	 */
	getPageCount = ( total, denominator ) => {
		const divisible	= 0 === total % denominator;
		const valueToBeAdded = divisible ? 0 : 1;
		return Math.floor( total/denominator ) + valueToBeAdded;
	};

	/**
	 * Fetch the search results and update the state with the result.
	 * Also cancels the previous query before making the new one.
	 *
	 * @param {int} updatedPageNo Updated Page No.
	 * @param {String} query Search Query.
	 *
	 */
	fetchSearchResults = ( updatedPageNo = '', query ) => {
		const pageNumber = updatedPageNo ? `&page=${updatedPageNo}` : '';
		// const searchUrl = `https://pixabay.com/api/?key=25991533-b2cebdcf6d9ac250f076a26ce&q=${query}${pageNumber}`;
		const searchUrl = `http://127.0.0.1:5000/citynames`;

		console.log("updated page: ", updatedPageNo);
		if( this.cancel ) {
			this.cancel.cancel();
		}
		this.cancel = axios.CancelToken.source();

		var data = JSON.stringify({
			"text_query": query
		});
		var config = {
			// cancelToken: this.cancel.token
			method: 'post',
			url: searchUrl,
			headers: {
				'Content-Type': 'application/json'
			},
			data : data
		};
		// console.log("-1----- ", this.state);
		axios(config)
			.then( res => {
				console.log(JSON.stringify(res.data));
				// console.log("-2----- ", this.state);

				const total = res.data.total_city;
				// const totalPagesCount = this.getPageCount( total, 20 );
				// console.log(res.data.cities.length, " <-length");
				const resultNotFoundMsg = !(res.data.cities.length)
										? 'There are no more search results. Please try a new search'
										: '';
				// console.log("resultNotFoundMsg-> ", resultNotFoundMsg);
				console.log("-3----- ", total);

				this.setState( {
					results: res.data.cities,
					message: resultNotFoundMsg,
					totalResults: total,
					// totalPages: totalPagesCount,
					currentPageNo: updatedPageNo,
					loading: false
				} )
				// console.log(this.state, " <-state2");
			} )
			.catch( error => {
				if ( axios.isCancel(error) || error ) {
					this.setState({
						loading: false,
						message: 'Failed to fetch the data. Please check network'
					})
				}
			} )
	};

	handleOnInputChange = ( event ) => {
		const query = event.target.value;
		if ( ! query ) {
			this.setState( { query, results: {}, message: '', totalPages: 0, totalResults: 0 } );
		} else {
			this.setState( { query, loading: true, message: '' }, () => {
				this.fetchSearchResults( 1, query );
			} );
		}
	};

	/**
	 * Fetch results according to the prev or next page requests.
	 *
	 * @param {String} type 'prev' or 'next'
	 */
	handlePageClick = ( type ) => {
		event.preventDefault();
		const updatePageNo = 'prev' === type
			? this.state.currentPageNo - 1
			: this.state.currentPageNo + 1;

		if( ! this.state.loading  ) {
			this.setState( { loading: true, message: '' }, () => {
				this.fetchSearchResults( updatePageNo, this.state.query );
			} );
		}
	};

	renderSearchResults = () => {
		const { results } = this.state;

		console.log("results----> ", results);
		if ( Object.keys( results ).length && results.length ) {
			return (
				<div className="results-container">
						{ results.map( result => {
							return (
								<a className="result-item">
									{/*<div className="image-wrapper">*/}
										{/*<img className="image" src={ result.previewURL } alt={`${result.username} image`}/>*/}
										<h6 className="image-username">{result}</h6>
									{/*</div>*/}
								</a>
							)
						} ) }
				</div>
			)
		}
	};

	render() {
		const { query, loading, message, currentPageNo, totalPages } = this.state;

		const showPrevLink = 1 < currentPageNo;
		const showNextLink = totalPages > currentPageNo;

		return (
			<div className="container">
			{/*	Heading*/}
			<h2 className="heading">Live Search: React Application</h2>
			{/* Search Input*/}
			<label className="search-label" htmlFor="search-input">
				<input
					type="text"
					name="query"
					value={ query }
					id="search-input"
					placeholder="Search..."
					onChange={this.handleOnInputChange}
				/>
				<i className="fa fa-search search-icon" aria-hidden="true"/>
			</label>

			{/*	Error Message*/}
				{message && <p className="message">{ message }</p>}

			{/*	Loader*/}
			<img src={ Loader } className={`search-loading ${ loading ? 'show' : 'hide' }`} alt="loader"/>

			{/*Navigation*/}
			<PageNavigation
				loading={loading}
				showPrevLink={showPrevLink}
				showNextLink={showNextLink}
				handlePrevClick={ () => this.handlePageClick('prev', event )}
				handleNextClick={ () => this.handlePageClick('next', event )}
			/>

			{/*	Result*/}
			{ this.renderSearchResults() }

			{/*Navigation*/}
			<PageNavigation
				loading={loading}
				showPrevLink={showPrevLink}
				showNextLink={showNextLink}
				handlePrevClick={ () => this.handlePageClick('prev', event )}
				handleNextClick={ () => this.handlePageClick('next', event )}
			/>

			</div>
		)
	}
}

export default Search
